/**
 * SetupEnhancedMeasurementSwitch component.
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
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_FORMS } from '../../../../googlesitekit/datastore/forms/constants';
import { MODULES_ANALYTICS } from '../../../analytics/datastore/constants';
import {
	ENHANCED_MEASUREMENT_ENABLED,
	ENHANCED_MEASUREMENT_FORM,
	MODULES_ANALYTICS_4,
	PROPERTY_CREATE,
	WEBDATASTREAM_CREATE,
} from '../../datastore/constants';
import EnhancedMeasurementSwitch from '../common/EnhancedMeasurementSwitch';
import {
	isValidPropertyID,
	isValidPropertySelection,
	isValidWebDataStreamID,
	isValidWebDataStreamSelection,
} from '../../utils/validation';
import { isValidAccountID } from '../../../analytics/util';
const { useSelect, useDispatch } = Data;

export default function SetupEnhancedMeasurementSwitch() {
	const accountID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getAccountID()
	);

	const propertyID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).getPropertyID()
	);

	const webDataStreamID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).getWebDataStreamID()
	);

	const isLoadingPropertySummaries = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).isLoadingPropertySummaries()
	);

	const isLoadingWebDataStreams = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).isLoadingWebDataStreams( {
			hasModuleAccess: true,
		} )
	);

	const isEnhancedMeasurementAlreadyEnabled = useSelect( ( select ) => {
		if ( isLoadingPropertySummaries || isLoadingWebDataStreams ) {
			return undefined;
		}

		if (
			! isValidPropertyID( propertyID ) ||
			! isValidWebDataStreamID( webDataStreamID )
		) {
			return null;
		}

		return select(
			MODULES_ANALYTICS_4
		).isEnhancedMeasurementStreamAlreadyEnabled(
			propertyID,
			webDataStreamID
		);
	} );

	const isLoading = useSelect( ( select ) => {
		if (
			! isValidPropertySelection( propertyID ) ||
			! isValidWebDataStreamSelection( webDataStreamID ) ||
			isLoadingPropertySummaries ||
			isLoadingWebDataStreams
		) {
			return true;
		}

		if (
			propertyID === PROPERTY_CREATE ||
			webDataStreamID === WEBDATASTREAM_CREATE
		) {
			return false;
		}

		return ! select( MODULES_ANALYTICS_4 ).hasFinishedResolution(
			'isEnhancedMeasurementStreamAlreadyEnabled',
			[ propertyID, webDataStreamID ]
		);
	} );

	const isEnhancedMeasurementEnabled = useSelect( ( select ) =>
		select( CORE_FORMS ).getValue(
			ENHANCED_MEASUREMENT_FORM,
			ENHANCED_MEASUREMENT_ENABLED
		)
	);

	const { setValues } = useDispatch( CORE_FORMS );

	// If `isEnhancedMeasurementEnabled` is already defined in the first render, it means we're rendering this component
	// after the user has actively selected the setting, in which case we don't want to override the setting to `true` in
	// the `useEffect()` unless the account, property, or web data stream selection is subsequently changed.
	const skipEffect = useRef( isEnhancedMeasurementEnabled !== undefined );

	useEffect( () => {
		if ( skipEffect.current ) {
			skipEffect.current = false;
			return;
		}

		setValues( ENHANCED_MEASUREMENT_FORM, {
			[ ENHANCED_MEASUREMENT_ENABLED ]: true,
		} );
	}, [ accountID, propertyID, webDataStreamID, setValues ] );

	if ( ! isValidAccountID( accountID ) ) {
		return null;
	}

	return (
		<EnhancedMeasurementSwitch
			loading={ isLoading }
			isEnhancedMeasurementAlreadyEnabled={
				isEnhancedMeasurementAlreadyEnabled
			}
		/>
	);
}
