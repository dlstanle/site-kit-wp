/**
 * Tests for WP Error Utilities.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
 * Internal dependencies
 */
import { isWPError } from './is-wp-error';

describe( 'isWPError', () => {
	const code = '';
	const message = '';
	const data = {};

	it( 'should return TRUE if a correct error is passed', () => {
		expect( isWPError( { code, message, data } ) ).toBeTruthy();
	} );

	it( 'should return TRUE even if an error with numeric code is passed', () => {
		expect( isWPError( { code: 401, message, data } ) ).toBeTruthy();
	} );

	it( 'should return TRUE even if an error with non-object data is passed', () => {
		expect( isWPError( { code, message, data: '' } ) ).toBeTruthy();
	} );

	it( 'should return FALSE if the passed object does not have needed properties', () => {
		expect( isWPError( { code, message } ) ).toBeFalsy();
	} );

	it( 'should return FALSE if the provided object has wrong property types', () => {
		expect( isWPError( { code, message: [], data } ) ).toBeFalsy();
	} );
} );
