<?php

namespace App\Concerns;

use App\Models\AddressBook;

/**
 * Trait HasMetaFields
 *
 * @package Corcel\Traits
 * @author Junior Grossi <juniorgro@gmail.com>
 */
trait PostHelper
{
    protected $typedClasses = [
        'address-book' => AddressBook::class
        // 'course' => Course::class,
        // 'language' => Language::class,
        // 'course-work' => CourseWork::class,
        // 'course-work-test' => Test::class,
        // 'question' => Question::class
    ];

    public function children($type)
    {
        return $this->hasMany($this->getRelationClass($type), 'post_parent');
    }
    public function child($type)
    {
        return $this->hasOne($this->getRelationClass($type), 'post_parent');
    }
    public function childTo($type)
    {
        return $this->belongsTo($this->getRelationClass($type), 'post_parent');
    }
    public function childToMany($type)
    {
        return $this->belongsToMany($this->getRelationClass($type), 'post_parent');
    }
    public function getRelationClass($type)
    {
        return $this->typedClasses[$type] ?? Post::class;
    }
}
