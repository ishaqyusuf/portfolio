<?php

namespace App\Builder;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SuperBuilder extends PostBuilder
{
    public function nothing()
    {
        return $this;
    }
    public function whereDateRange($value, $column, $operator = '>=')
    {
        $this->whereNotNull($column);
        $this->whereDate($column, $operator, $value);
        // $this->where(function ($query) use ($value, $column,$operator) {
        //     $query->where(function ($query) use ($from, $to) {
        //         $query->whereNull($from);
        //         $query->whereNotNull($to);
        //     })->orWhere(function ($query) use ($value, $from, $to, $inclusive) {
        //         $query->whereDate($from, $inclusive ? '<=' : '<', $value);
        //     });
        // });
        return $this;
    }
    public function whereDateBetween($value, $from, $to, $inclusive = true)
    {
        $this->whereDateRange($value, $from, $inclusive ? '<=' : '<');
        $this->orWhere(fn ($query) => $query->whereDateRange($value, $to, $inclusive ? '>=' : '>'));
        return $this;
        // $this->where(function ($query) use ($value, $from, $to, $inclusive) {
        //     $query->where(function ($query) use ($from, $to) {
        //         $query->whereNull($from);
        //         $query->whereNotNull($to);
        //     })->orWhere(function ($query) use ($value, $from, $to, $inclusive) {
        //         $query->whereDate($from, $inclusive ? '<=' : '<', $value);
        //     });
        // });
        // return $this;
        // return $this->where(
        //     function ($query) use ($date) {
        //         $query->where(function ($query) use ($date) {
        //             $query->where(function ($query) use ($date) {
        //                 $query->whereNull('start_date');
        //                 $query->whereNotNull('end_date');
        //             });
        //             $query->orWhere(function ($query) use ($date) {
        //                 $query->whereDate('start_date', '<=', $date);
        //             });
        //         });
        //         $query->where(function ($query) use ($date) {
        //             $query->where(function ($query) use ($date) {
        //                 $query->whereNull('end_date');
        //                 $query->whereNotNull('start_date');
        //             });
        //             $query->orWhere(function ($query) use ($date) {
        //                 $query->whereDate('end_date', '>=', $date);
        //             });
        //         });
        //     }
        // );
    }
    public function whereLike2($columns, $values)
    {
        return  $this->where(
            function (Builder $query) use ($columns, $values) {
                $vals = collect(Arr::wrap($values));
                $first = $vals->first();
                $others = $vals->slice(1)->values();
                $cols = Arr::wrap($columns);
                $firstColumn = $cols[0];
                foreach ($cols as $column) {
                    $column == $firstColumn ?
                        $query->where($column, 'LIKE', "%{$first}%") :
                        $query->orWhere($column, 'LIKE', "%{$first}%");
                    foreach ($others as $value)
                        return $query->orWhere($column, 'LIKE', "%{$value}%");
                }
                return $query;
            }
        );
    }
    public function whereLike($columns, $values)
    {
        return  $this->where(function (Builder $query) use ($columns, $values) {
            $vals = collect(Arr::wrap($values));
            $first = $vals->first();
            $others = $vals->slice(1)->values();
            $cols = Arr::wrap($columns);
            $firstColumn = $cols[0];
            foreach ($cols as $column) {
                $query->when(
                    Str::contains($column, '.'),

                    // Relational searches
                    function (Builder $query) use ($column, $first, $others) {
                        $parts = explode('.', $column);
                        $relationColumn = array_pop($parts);
                        $relationName = join('.', $parts);

                        // foreach (Arr::wrap($values) as $value)
                        return $query->orWhereHas(
                            $relationName,
                            function (Builder $query) use ($relationColumn, $first, $others) {
                                $query->where($relationColumn, 'LIKE', "%{$first}%");
                                foreach ($others as $value)
                                    $query->orWhere($relationColumn, 'LIKE', "%{$value}%");
                            }
                        );
                    },

                    // Default searches
                    function (Builder $query) use ($column, $first, $others, $firstColumn) {
                        $column == $firstColumn ?
                            $query->where($column, 'LIKE', "%{$first}%") :
                            $query->orWhere($column, 'LIKE', "%{$first}%");
                        foreach ($others as $value)
                            return $query->orWhere($column, 'LIKE', "%{$value}%");
                    }
                );
            }
        });
    }
    public function whereDates($column, $values)
    {
        $vals = collect(Arr::wrap($values));
        $first = $vals->first();
        $others = $vals->slice(1)->values();

        $this->whereDate($column, $first);
        foreach ($others as $date)
            $this->orWhereDate($column, $date);
        return $this;
    }

    public function timeQuery()
    {
        $r = request();
        $mode = Carbon::today()->subDays(7);
        switch ($r->range) {
            case 'today':
                $mode = Carbon::today()->subDays(3);
                $r->today = true;
                break;
            case 'w':
                $mode = Carbon::today()->subDays(7);
                break;
            case '2w':
                $mode = Carbon::today()->subDays(14);
                break;
            case 'm':
                $mode = Carbon::today()->subMonth()->day(1);
                break;
            case '3m':
                $mode = Carbon::today()->subMonths(3)->day(1);
                break;
            case '6m':
                $mode = Carbon::today()->subMonths(6)->day(1);
                break;
            case 'y':
                $mode = Carbon::today()->subYear()->format('Y');
                $r->mode_year = true;
                break;
        }
        $r->mode_year ?
            $this->whereYear('created_at', '>=', $mode) :
            $this->whereDate('created_at', '>=', $mode);
        $r->_format = $r->mode_year ? 'Y/m' : ($r->today ? 'h' : 'Y/m/d');
        return $this;
    }
}
