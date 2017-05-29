/**
 * External dependencies
 */
var jsdom = require( 'jsdom' ).jsdom,
	assign = require( 'lodash.assign' ),
	debug = require( 'debug' )( 'react-test-env' );

/**
 * Module variables
 */
var defaultFeatures = {
	localStorage: true,
	XMLHttpRequest: true
};

function setupTestEnv( markup, features ) {
	features = assign( {}, defaultFeatures, features );

	global.document = jsdom( markup, {
		url: 'http://example.com/',
		features: {
			FetchExternalResources: false,
			ProcessExternalResources: false
		}
	} );
	global.window = document.defaultView;
	global.navigator = window.navigator;
	global.Element = window.Element;
	global.history = window.history;
	global.Image = window.Image;

	if ( features.localStorage ) {
		require( './local-storage' )( global );
	}

	if ( features.XMLHttpRequest ) {
		global.XMLHttpRequest = window.XMLHttpRequest;
	}
}

function cleanup() {
	delete global.document;
	delete global.window;
	delete global.navigator;
	delete global.Element;
	delete global.history;
	delete global.Image;
	if ( global.localStorage ) {
		if ( global.localStorage.clear ) {
			global.localStorage.clear();
		}
		delete global.localStorage;
	}
	delete global.XMLHttpRequest;
}

function domWrapper( markup, features ) {
	before( function setupFakeDom() {
		debug( 'setting up dom env' );
		setupTestEnv( markup, features );
	} );

	after( function cleanupFakeDom() {
		debug( 'cleaning dom env' );
		setupTestEnv.cleanup();
	} );
}

domWrapper.withContainer = function withContainer() {
	domWrapper( '<html><head><title>test</title></head><body><div id="container"></div></body></html>' );
};

domWrapper.getContainer = function getContainer() {
	return document.getElementById( 'container' );
};

module.exports = setupTestEnv;
module.exports.cleanup = cleanup;
module.exports.useFakeDom = domWrapper;
