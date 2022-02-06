<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class ParcelTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_fetch_parcels()
    {
        //perry: 223
        // Auth::loginUsingId(223);
        $this->get('/parcels', [
            'x-device-id' => "029da4740b985792c7ac04c53f47cc57", 'x-token' => "AMVyBPldGhJMU0j6rG1vapoXSkqwRnkQOLqBpY1BAK91RVs1LYTtIlxfNTnH"
        ])->assertStatus(200)->assertJson(['success' => true, 'data' => true]);
    }
}
