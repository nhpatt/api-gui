import React from 'react';

import javascriptExample from './templates/javascriptExample';

style = {
	overflow: 'visible',
	tabSize: 4
};

const JavascriptExample = ({method, url}) => {
	return (
		<div className="card overflow-auto vh-100">
			<div className="p-3">
				<pre style={style}>{javascriptExample(method, url)}</pre>
			</div>
		</div>
	);
}

export default JavascriptExample;