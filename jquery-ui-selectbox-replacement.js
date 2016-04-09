/*!
 * Selectbox replacement based on jQuery UI Widget
 * Author: office@slicemenice.de
 * Licensed under the MIT license
 *
 *  Requires UI version 1.9+
 */

( function( $, window, document, undefined ) {

	$.widget( 'smn.selectboxReplacement', {

		options: {
			template: '<div class="selectbox"><div class="selectbox_text"></div></div>',
			wrapperClass: 'selectbox',
			textContainerSelector: '.selectbox_text',
			disabledClass: 'disabled'
		},

		_create: function() {
			var widget = this;

			widget._trigger( 'willBeInitialized' );

			var $parent = widget.element.parent();

			var wrapperClasses = widget.options.wrapperClass;
			if ( false === $.isArray( wrapperClasses ) ) {
				wrapperClasses = [ widget.options.wrapperClass ];
			}

			var parentHasAllWrapperClasses = true;

			$( wrapperClasses ).each( function( index, classname ) {
				parentHasAllWrapperClasses = $parent.hasClass( classname );

				if ( false === parentHasAllWrapperClasses ) {
					// break for-each
					return false;
				}
			} );

			// only wrap the checkbox, if it is not already wrapped with an element containing the wrapper class(es)
			if ( false === parentHasAllWrapperClasses ) {
				widget.wrapper = $( widget.options.template );
				widget.wrapper.insertBefore( widget.element );
				widget.element.appendTo( widget.wrapper );
			} else {
				widget.wrapper = $parent;
			}

			widget.textContainer = widget.wrapper.find( widget.options.textContainerSelector );

			widget._disabled = false;

			widget._registerEventListeners();
			widget._updateTextForSelectedValue();

			var disabled = widget.element.attr( 'disabled' );

			if ( typeof disabled !== typeof undefined && disabled !== false ) {
				widget.disabled( true );
			}

			widget._trigger( 'hasBeenInitialized' );
		},

		getWrapper: function() {
			var widget = this;
			return widget.wrapper;
		},

		_destroy: function() {
			var widget = this;
			widget._trigger( 'willBeDestroyed' );


			widget._trigger( 'hasBeenDestroyed' );
		},

		disabled: function( state ) {
			var widget = this;

			// no value passed, act as a getter.
			if ( state === undefined ) {
				return widget._disabled;
			}

			var fn = ( state === true ) ? 'addClass' : 'removeClass';

			widget.wrapper[ fn ]( widget.options.disabledClass );
			widget._disabled = state;
		},

		// Respond to any changes the user makes to the option method
		_setOption: function( key, value ) {
			switch ( key ) {
				default:
					this.options[ key ] = value;
					break;
			}

			this._super( '_setOption', key, value );
		},

		_registerEventListeners: function() {
			var widget = this;

			widget.element.on( 'change.selectboxReplacement', widget._onChange.bind( widget ) );
		},

		_onChange: function() {
			var widget = this;
			widget._updateTextForSelectedValue();
		},

		_updateTextForSelectedValue: function() {
			var widget = this;
			widget.textContainer.text( widget.element.find( 'option:selected' ).text() );
		}

	} );

} )( jQuery, window, document );