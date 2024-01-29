/**
 * Tag Manager Use First party Serving Switch component.
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
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { Switch } from 'googlesitekit-components';
import { MODULES_TAGMANAGER } from '../../datastore/constants';
import { trackEvent } from '../../../../util';
import useViewContext from '../../../../hooks/useViewContext';
const { useSelect, useDispatch } = Data;

export default function UseFirstPartyServingSwitch() {
	const useFirstPartyServing = useSelect( ( select ) =>
		select( MODULES_TAGMANAGER ).getUseFirstPartyServing()
	);
	const useSnippet = useSelect( ( select ) =>
		select( MODULES_TAGMANAGER ).getUseSnippet()
	);

	const viewContext = useViewContext();

	const { setUseFirstPartyServing } = useDispatch( MODULES_TAGMANAGER );
	const onChange = useCallback( () => {
		const newUseFirstPartyServing = ! useFirstPartyServing;
		setUseFirstPartyServing( newUseFirstPartyServing );
		trackEvent(
			`${ viewContext }_tagmanager`,
			newUseFirstPartyServing
				? 'enable_firstpartyserving'
				: 'disable_firstpartyserving'
		);
	}, [ setUseFirstPartyServing, useFirstPartyServing, viewContext ] );

	if ( useFirstPartyServing === undefined || useSnippet === undefined ) {
		return null;
	}

	const description = useSnippet ? (
		<p>
			{ __(
				"Site Kit is not injecting the tag into your site. First party serving can't be enabled.",
				'google-site-kit'
			) }
		</p>
	) : (
		<p>
			{ __(
				'All tagging data will be sent through your WordPress server',
				'google-site-kit'
			) }
		</p>
	);

	return (
		<div className="googlesitekit-tagmanager-usefirstpartyserving">
			<Switch
				label={ __( 'Enable first party serving', 'google-site-kit' ) }
				checked={ useFirstPartyServing }
				disabled={ ! useSnippet }
				onClick={ onChange }
				hideLabel={ false }
			/>
			{ description }
		</div>
	);
}
