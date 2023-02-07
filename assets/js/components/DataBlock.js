/**
 * DataBlock component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useCallback, cloneElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import GatheringDataNotice, { NOTICE_STYLE } from './GatheringDataNotice';
import { numFmt } from '../util';
import DataBlockAddons from './DataBlockAddons';

const DataBlock = ( {
	stat,
	className = '',
	title = '',
	datapoint,
	datapointUnit,
	change,
	changeDataUnit = '',
	context = 'default',
	period = '',
	selected = false,
	source,
	sparkline,
	handleStatSelection,
	invertChangeColor = false,
	gatheringData,
	gatheringDataNoticeStyle = NOTICE_STYLE.DEFAULT,
} ) => {
	const handleClick = useCallback( () => {
		if ( ! gatheringData && handleStatSelection ) {
			handleStatSelection( stat );
		}
	}, [ gatheringData, handleStatSelection, stat ] );

	const handleKeyDown = useCallback(
		( e ) => {
			e.preventDefault();
			if ( 'Enter' === e.key || ' ' === e.key ) {
				handleClick();
			}
		},
		[ handleClick ]
	);

	// The `sparkline` prop is passed as a component, but if `invertChangeColor`
	// is set, we should pass that to `<Sparkline>`. In that case, we clone
	// the element and add the prop.
	let sparklineComponent = sparkline;
	if ( sparklineComponent && invertChangeColor ) {
		sparklineComponent = cloneElement( sparkline, {
			invertChangeColor,
		} );
	}

	const datapointFormatted =
		datapoint === undefined
			? datapoint
			: numFmt( datapoint, datapointUnit );

	const isButtonContext = 'button' === context;
	const role = isButtonContext ? 'button' : '';

	return (
		<div
			className={ classnames(
				'googlesitekit-data-block',
				className,
				`googlesitekit-data-block--${ context }`,
				{
					'googlesitekit-data-block--selected': selected,
					'googlesitekit-data-block--is-gathering-data':
						gatheringData,
				}
			) }
			tabIndex={ isButtonContext && ! gatheringData ? '0' : '-1' }
			role={ handleStatSelection && role }
			onClick={ handleClick }
			onKeyDown={ handleKeyDown }
			aria-disabled={ gatheringData || undefined }
			aria-label={ handleStatSelection && title }
			aria-pressed={ handleStatSelection && selected }
		>
			<div className="googlesitekit-data-block__title-datapoint-wrapper">
				<h3
					className="
						googlesitekit-subheading-1
						googlesitekit-data-block__title
					"
				>
					{ title }
				</h3>

				{ ! gatheringData && (
					<div className="googlesitekit-data-block__datapoint">
						{ datapointFormatted }
					</div>
				) }
			</div>
			{ ! gatheringData && (
				<DataBlockAddons
					sparklineComponent={ sparklineComponent }
					change={ change }
					changeDataUnit={ changeDataUnit }
					period={ period }
					invertChangeColor={ invertChangeColor }
					source={ source }
				/>
			) }

			{ gatheringData && (
				<GatheringDataNotice style={ gatheringDataNoticeStyle } />
			) }
		</div>
	);
};

DataBlock.propTypes = {
	stat: PropTypes.number,
	className: PropTypes.string,
	title: PropTypes.string,
	datapoint: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	datapointUnit: PropTypes.string,
	change: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	changeDataUnit: PropTypes.oneOfType( [ PropTypes.string, PropTypes.bool ] ),
	context: PropTypes.string,
	period: PropTypes.string,
	selected: PropTypes.bool,
	handleStatSelection: PropTypes.func,
	invertChangeColor: PropTypes.bool,
	gatheringData: PropTypes.bool,
	gatheringDataNoticeStyle: PropTypes.oneOf( Object.values( NOTICE_STYLE ) ),
};

export default DataBlock;
