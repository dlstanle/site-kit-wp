<?php
/**
 * Functions Google\Site_Kit\Modules\FirstPartyServingSetup
 *
 * @package   Google\Site_Kit\Modules
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules;

/**
 * Removes the mpath rewrite rule and flushes.
 *
 * @since 1.24.0
 */
function remove_mpath_rewrite_rule() {
	flush_rewrite_rules( true );
}

/**
 * Adds new mpath rewrite rule and flushes.
 *
 * @since 1.24.0
 */
function add_mpath_rewrite_rule() {
	$fps_path = plugins_url( 'FirstPartyServing.php', __FILE__ );
	$match   = '^' . 'wp-fps' . '\/([^\?]+)(.*)$';
	$rewrite = fps_path . '?mpath=$matches[1]&$matches[2]';
	add_rewrite_rule( $match, $rewrite, 'top' );
	flush_rewrite_rules( true );
}
