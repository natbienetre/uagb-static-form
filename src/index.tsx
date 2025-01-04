import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, TextControl } from '@wordpress/components';
import React from 'react';

const allowedBlocks = [ 'uagb/forms' ];

function addAttributes( settings: { attributes: Object }, name: string ) {
	if ( ! allowedBlocks.includes( name ) ) {
		return settings;
	}

	// Ajout de l'attribut et de sa valeur par défaut
	settings.attributes = Object.assign( settings.attributes, {
		actionDestination: {
			type: 'string',
			source: 'attribute',
			default: '',
			selector: 'form',
			attribute: 'action',
		},
	} );

	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'uagb-static-form/formActionAttributes',
	addAttributes
);

const addAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props: {
		name: string;
		attributes: { actionDestination: string };
		setAttributes: ( { actionDestination: string } ) => void;
		isSelected: boolean;
	} ) => {
		const { name, attributes, setAttributes, isSelected } = props;

		if ( ! allowedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { actionDestination } = attributes;

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ isSelected && (
					<InspectorControls>
						<PanelBody
							title={ __( 'Actions', 'uagb-static-form' ) }
						>
							<TextControl
								label={ __(
									'Destination',
									'uagb-static-form'
								) }
								value={ actionDestination }
								onChange={ ( newDestination ) => {
									setAttributes( {
										actionDestination: newDestination,
									} );
								} }
							/>
						</PanelBody>
					</InspectorControls>
				) }
			</Fragment>
		);
	};
}, 'addAdvancedControls' );
addFilter(
	'editor.BlockEdit',
	'uagb-static-form/actionAdvancedControl',
	addAdvancedControls
);

const addActionAttributeToBlock = createHigherOrderComponent( ( Block ) => {
	return ( props ) => {
		const { name } = props;
		const { actionDestination } = props.attributes;

		if ( ! allowedBlocks.includes( name ) ) {
			return <Block { ...props } />;
		}

		return <Block { ...props } action={ actionDestination } />;
	};
}, 'addActionAttributeToBlock' );
addFilter(
	'editor.BlockListBlock',
	'uagb-static-form/actionAttribute',
	addActionAttributeToBlock
);

function applyExtraAction(
	extraProps: { children: Array< React.ReactElement > },
	blockType: { name: string },
	attributes: { actionDestination: string }
) {
	if ( ! allowedBlocks.includes( blockType.name ) ) {
		return extraProps;
	}

	return {
		...extraProps,
		children: React.Children.map( extraProps.children, ( child ) => {
			if ( 'form' !== child.type ) {
				return child;
			}

			return React.cloneElement( child, {
				action: attributes.actionDestination,
			} );
		} ),
	};
}
addFilter(
	'blocks.getSaveContent.extraProps',
	'uagb-static-form/applyExtraAction',
	applyExtraAction
);
