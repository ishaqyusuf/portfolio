<?php

namespace App\Builder;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

/**
 * Class PostBuilder
 *
 * @package Corcel\Model\Builder
 * @author Junior Grossi <juniorgro@gmail.com>
 */
class PostBuilder extends Builder
{


    /**
     * @param string $type
     * @return PostBuilder
     */
    public function type($type)
    {
        return $this->whereType($type);
    }

    /**
     * @param array $types
     * @return PostBuilder
     */
    public function typeIn(array $types)
    {
        return $this->whereIn('type', $types);
    }

    /**
     * @param string $slug
     * @return PostBuilder
     */
    public function slug($slug)
    {
        return $this->where('post_name', $slug);
    }

    /**
     * @param string $postParentId
     * @return PostBuilder
     */
    public function parent($postParentId)
    {
        return $this->whereParentId($postParentId);
    }

    /**
     * @param string $taxonomy
     * @param mixed $terms
     * @return PostBuilder
     */
    public function taxonomy($taxonomy, $terms)
    {
        return $this->whereHas('taxonomies', function ($query) use ($taxonomy, $terms) {
            $query->where('taxonomy', $taxonomy)
                ->whereHas('term', function ($query) use ($terms) {
                    $query->whereIn('slug', is_array($terms) ? $terms : [$terms]);
                });
        });
    }

    /**
     * @param mixed $term
     * @return PostBuilder
     */
    public function search($term = false)
    {
        if (empty($term)) {
            return $this;
        }

        $terms = is_string($term) ? explode(' ', $term) : $term;

        $terms = collect($terms)->map(function ($term) {
            return trim(str_replace('%', '', $term));
        })->filter()->map(function ($term) {
            return '%' . $term . '%';
        });

        if ($terms->isEmpty()) {
            return $this;
        }

        return $this->where(function ($query) use ($terms) {
            $terms->each(function ($term) use ($query) {
                $query->orWhere('post_title', 'like', $term)
                    ->orWhere('post_excerpt', 'like', $term)
                    ->orWhere('post_content', 'like', $term);
            });
        });
    }
}
