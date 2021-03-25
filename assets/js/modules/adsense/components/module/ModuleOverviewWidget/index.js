/**
 * ModuleOverviewWidget component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../../datastore/constants';
import { CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { isZeroReport } from '../../../util';
import ProgressBar from '../../../../../components/ProgressBar';
import Header from './Header';
import Overview from './Overview';
import Stats from './Stats';
import Data from 'googlesitekit-data';
const { useSelect } = Data;

const ModuleOverviewWidget = ( { Widget, WidgetReportZero, WidgetReportError } ) => {
	const metrics = {
		EARNINGS: __( 'Earnings', 'google-site-kit' ),
		PAGE_VIEWS_RPM: __( 'Page RPM', 'google-site-kit' ),
		IMPRESSIONS: __( 'Impressions', 'google-site-kit' ),
		PAGE_VIEWS_CTR: __( 'Page CTR', 'google-site-kit' ),
	};
	const [ selectedStats, setSelectedStats ] = useState( 0 );

	const {
		startDate,
		endDate,
		compareStartDate,
		compareEndDate,
	} = useSelect( ( select ) => select( CORE_USER ).getDateRangeDates( { compare: true } ) );

	const currentRangeArgs = {
		metrics: Object.keys( metrics ),
		startDate,
		endDate,
	};
	const previousRangeArgs = {
		metrics: Object.keys( metrics ),
		startDate: compareStartDate,
		endDate: compareEndDate,
	};
	const currentRangeChartArgs = {
		...currentRangeArgs,
		dimensions: [ 'DATE' ],
	};
	const previousRangeChartArgs = {
		...previousRangeArgs,
		dimensions: [ 'DATE' ],
	};

	const currentRangeData = useSelect( ( select ) => select( STORE_NAME ).getReport( currentRangeArgs ) );
	const previousRangeData = useSelect( ( select ) => select( STORE_NAME ).getReport( previousRangeArgs ) );
	const currentRangeChartData = useSelect( ( select ) => select( STORE_NAME ).getReport( currentRangeChartArgs ) );
	const previousRangeChartData = useSelect( ( select ) => select( STORE_NAME ).getReport( previousRangeChartArgs ) );

	const currentRangeLoading = useSelect( ( select ) => ! select( STORE_NAME ).hasFinishedResolution( 'getReport', [ currentRangeArgs ] ) );
	const previousRangeLoading = useSelect( ( select ) => ! select( STORE_NAME ).hasFinishedResolution( 'getReport', [ previousRangeArgs ] ) );
	const currentRangeChartLoading = useSelect( ( select ) => ! select( STORE_NAME ).hasFinishedResolution( 'getReport', [ currentRangeChartArgs ] ) );
	const previousRangeChartLoading = useSelect( ( select ) => ! select( STORE_NAME ).hasFinishedResolution( 'getReport', [ previousRangeChartArgs ] ) );

	const currentRangeError = useSelect( ( select ) => select( STORE_NAME ).getErrorForSelector( 'getReport', [ currentRangeArgs ] ) );
	const previousRangeError = useSelect( ( select ) => select( STORE_NAME ).getErrorForSelector( 'getReport', [ previousRangeArgs ] ) );
	const currentRangeChartError = useSelect( ( select ) => select( STORE_NAME ).getErrorForSelector( 'getReport', [ currentRangeChartArgs ] ) );
	const previousRangeChartError = useSelect( ( select ) => select( STORE_NAME ).getErrorForSelector( 'getReport', [ previousRangeChartArgs ] ) );

	const handleStatsSelection = useCallback( ( stat ) => {
		setSelectedStats( stat );
	}, [] );

	if ( currentRangeLoading || previousRangeLoading || currentRangeChartLoading || previousRangeChartLoading ) {
		return <ProgressBar />;
	}

	if ( currentRangeError || previousRangeError || currentRangeChartError || previousRangeChartError ) {
		return (
			<WidgetReportError
				moduleSlug="adsense"
				error={ currentRangeError || previousRangeError || currentRangeChartError || previousRangeChartError }
			/>
		);
	}

	if ( isZeroReport( currentRangeData ) || isZeroReport( currentRangeChartData ) ) {
		return <WidgetReportZero moduleSlug="adsense" />;
	}

	return (
		<Widget
			noPadding
			Header={ Header }
		>
			<Overview
				metrics={ metrics }
				currentRangeData={ currentRangeData }
				previousRangeData={ previousRangeData }
				selectedStats={ selectedStats }
				handleStatsSelection={ handleStatsSelection }
			/>

			<Stats
				metrics={ metrics }
				currentRangeData={ currentRangeChartData }
				previousRangeData={ previousRangeChartData }
				selectedStats={ selectedStats }
			/>
		</Widget>
	);
};

export default ModuleOverviewWidget;
