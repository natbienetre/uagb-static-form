<?php
/**
 * Plugin Name: UAGB Static Form
 * Plugin URI:  https://github.com/natbienetre/uagb-static-form
 * Description: Patching the UAGB form block for Gutenberg to work with Simply Static.
 * Author: Pierre PÉRONNET <pierre.peronnet@gmail.com>
 * Version: 0.0.1
 */

define( 'UAGB_STATIC_FORM_PATH', 'uagb-static-form' );

/**
 * Patch the rendering of the UAGB form block to work with Simply Static.
 *
 * This function adds the action attribute to the form tag.
 *
 * @param string $block_content The block content.
 * @param array $block The block attributes.
 * @param WP_Block $instance The block instance.
 */
function uagb_static_form_render_block_uagb_forms( string $block_content, array $block,  WP_Block $instance ) {
    $actionDestination = $instance->attributes['action_destination'];
    if ( ! $actionDestination ) {
        return $block_content;
    }

    return str_ireplace( '<form', '<form action="' . esc_url( $actionDestination ) . '"', $block_content );
}
add_filter( 'render_block_uagb/forms', 'uagb_static_form_render_block_uagb_forms', 10, 3 );

function uagd_static_form_enqueue_block_editor_assets() {
    if ( ! wp_enqueue_script( 'uagb-static-form-editor-assets', plugin_dir_url( __FILE__ ) . 'build/index.js', array( 'wp-blocks', 'wp-element' ), filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ), false ) ) {
        add_action( 'admin_notices', function() {
            ?><div class="notice notice-error">
                <p><?php _e( 'Failed to enqueue the UAGB Static Form editor assets.', 'uagb-static-form' ); ?></p>
            </div><?php
        } );
    }
}
add_action( 'enqueue_block_editor_assets', 'uagd_static_form_enqueue_block_editor_assets' );
