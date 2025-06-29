<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\View\Component;

class Translations extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $locale = App::getLocale();
        $translations = [];

        if(File::exists(base_path("lang/$locale"))){
            $translations = collect(File::allFiles(base_path("lang/$locale")))->filter(function ($file) {
                return $file->getExtension() === 'php';
            })->flatMap(function($file) {
                return Arr::dot(File::getRequire($file->getRealPath()));
            })->toArray();
        }

        return view('components.translations',['translations' =>$translations]);
    }
}
