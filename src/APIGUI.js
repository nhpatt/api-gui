import React, {useEffect, useMemo, useState} from 'react';

import ClayForm, {ClaySelect} from '@clayui/form';

import APIDisplay from './APIDisplay';
import CategoryList from './CategoryList';
import SchemaList from './SchemaList';

import useSearchParams from './hooks/useSearchParams';

import fetch from './util/fetch';
import {getBaseURL} from './util/url';

const APIDisplayStyle = {
	height: 'calc(100% - 104px)',
	overflowY: 'scroll'
};

const APIGUI = props => {
	const [apiCategories, setAPICategories] = useState({});
	const [paths, setPaths] = useState();
	const [schemas, setSchemas] = useState();

	const [selectedCategoryKey, setSelectedCategoryKey] = useSearchParams('APIGroup');
	const [path, setPath] = useSearchParams('path');
	const [selectedMethod, setMethod] = useSearchParams('method');

	useEffect(() => {
		if (paths) {
			setMethod(Object.keys(paths[path])[0])
		}
	},[path]);

	const categoryURL = apiCategories && selectedCategoryKey && apiCategories[selectedCategoryKey] ? apiCategories[selectedCategoryKey][0] : '';

	useEffect(() => {
		fetch('/o/openapi', 'get', {}).then(
			res => {
				var categories = {};

				Object.keys(res).map(key => {
					categories[key] = res[key].map(url => url.replace('openapi.yaml', 'openapi.json'));
				});

				if (!selectedCategoryKey) {
					setSelectedCategoryKey(Object.keys(categories)[0])
				}

				setAPICategories(categories);
			}
		);
	}, []);

	useEffect(() => {
		if (selectedCategoryKey && apiCategories[selectedCategoryKey]) {
			fetch(apiCategories[selectedCategoryKey], 'get', {}).then(
				categoryData => {
					setPaths(categoryData.paths);

					setSchemas(categoryData.components.schemas);
				}
			);
		}
	}, [selectedCategoryKey, apiCategories])

	return (
		<div className="api-gui-root">
			<div className="container container-fluid">
				<div className="row">
					<div className="col col-md-5 border p-0 overflow-auto vh-100">
						<ClayForm.Group className="px-3 pt-3">
							<label htmlFor="categorySelect">{'Select API Category'}</label>
							<ClaySelect
								aria-label="Select API Category"
								onChange={e => {setSelectedCategoryKey(e.currentTarget.value); setPath();}}
								value={selectedCategoryKey}
							>
								{Object.keys(apiCategories).map(key => (
									<ClaySelect.Option
										key={key}
										label={key}
										value={key}
									/>
								))}
							</ClaySelect>
						</ClayForm.Group>

						<div className="api-list border-top p-3" style={APIDisplayStyle}>
							{paths &&
								<CategoryList
									baseURL={selectedCategoryKey}
									curPath={path}
									onClick={(path) => setPath(path)}
									paths={paths}
								/>
							}
						</div>
					</div>

					<div className="col col-md-7 border p-3 overflow-auto vh-100">
						{path && paths && paths[path][selectedMethod] && 
							<APIDisplay
								baseURL={getBaseURL(categoryURL)}
								path={path}
								pathData={paths[path]}
								selectedMethod={selectedMethod}
								setMethod={setMethod}
							/>
						}
					</div>

					{false && paths && paths[path][selectedMethod] && schemas &&
						<div className="col col-md-2 border p-3 overflow-auto vh-100">
							<SchemaList methodData={paths[path][selectedMethod]} schemas={schemas} />
						</div>
					}
				</div>
			</div>
		</div>
	);
}

export default APIGUI;