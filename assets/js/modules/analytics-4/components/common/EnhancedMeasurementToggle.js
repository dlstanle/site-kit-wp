/**
 * EnhancedMeasurementToggle component.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { ProgressBar, Switch } from 'googlesitekit-components';
import { MODULES_ANALYTICS_4 } from '../../datastore/constants';
import {
	isValidPropertyID,
	isValidWebDataStreamID,
} from '../../utils/validation';
const { useSelect } = Data;

export default function EnhancedMeasurementToggle( {
	hasModuleAccess = true,
} ) {
	const { propertyID, webDataStreamID } = useSelect(
		( select ) => select( MODULES_ANALYTICS_4 ).getSettings() || {}
	);

	const enhancedMeasurementSettings = useSelect( ( select ) =>
		isValidPropertyID( propertyID ) &&
		isValidWebDataStreamID( webDataStreamID ) &&
		hasModuleAccess !== false
			? select( MODULES_ANALYTICS_4 ).getEnhancedMeasurementSettings(
					propertyID,
					webDataStreamID
			  )
			: null
	);

	const isLoading = useSelect( ( select ) => {
		const loadedEnhancedMeasurementSettings =
			isValidPropertyID( propertyID ) &&
			isValidWebDataStreamID( webDataStreamID ) &&
			hasModuleAccess !== false
				? select( MODULES_ANALYTICS_4 ).hasFinishedResolution(
						'getEnhancedMeasurementSettings',
						[ propertyID, webDataStreamID ]
				  )
				: true;
		return ! loadedEnhancedMeasurementSettings;
	} );

	const onChange = useCallback( () => {
		// Update the setting...
	}, [] );

	if ( enhancedMeasurementSettings === null ) {
		return null;
	}

	return (
		<div className="googlesitekit-settings-module__fields-group">
			<div className="googlesitekit-analytics-enable">
				{ isLoading && <ProgressBar height={ 20 } small /> }
				{ ! isLoading && (
					<Switch
						label={ __(
							'Enable enhanced measurement',
							'google-site-kit'
						) }
						checked={ Boolean(
							enhancedMeasurementSettings?.streamEnabled
						) } // This needs to be toggleable, not fixed to the current value.
						onClick={ onChange }
						hideLabel={ false }
						disabled={ ! hasModuleAccess }
					/>
				) }
				<p>
					{ __(
						'Toggle enhanced measurement on or off for this web data stream.',
						'google-site-kit'
					) }
				</p>
			</div>
		</div>
	);
}

EnhancedMeasurementToggle.propTypes = {
	hasModuleAccess: PropTypes.bool,
};
