<?php

/**
 * FirstPartyServing test file
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

/**
 * Debug to console
 */
function debug_to_console( $data ) {
    $output = $data;
    if ( is_array( $output ) )
        $output = implode( ',', $output );

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

$id = 'G-UNSET';
if ( isset( $_GET['id'] ) ) $id = $_GET['id'];
