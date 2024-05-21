import { describe, expect, test, vi } from 'vitest';
import { useReactive, useState } from 'leaner';
import { mount, onDestroy, onMount } from 'leaner/web';
import { runSchedule } from 'leaner/schedule.js';

describe( 'components', () => {
  test( 'simple component', () => {
    const Button = vi.fn( ( props, children ) => {
      return [ 'button', { type: 'button', ...props }, ...children ];
    } );

    function template() {
      return [ Button, { id: 'test' }, 'hello' ];
    }

    mount( template, document.body );

    expect( Button ).toHaveBeenCalledOnce();

    expect( document.body.innerHTML ).toBe( '<button type="button" id="test">hello</button>' );
  } );

  test( 'dynamic component', () => {
    const [ id, setId ] = useState( 'test' );
    const [ text, setText ] = useState( 'hello' );

    const Button = vi.fn( ( props, children ) => {
      return [ 'button', { type: 'button', ...props }, ...children ];
    } );

    function template() {
      return [ Button, { id }, text ];
    }

    mount( template, document.body );

    expect( Button ).toHaveBeenCalledOnce();

    expect( document.body.innerHTML ).toBe( '<button type="button" id="test">hello</button>' );

    Button.mockClear();

    setId( 'button' );
    setText( 'OK' );

    runSchedule();

    expect( Button ).not.toHaveBeenCalled();

    expect( document.body.innerHTML ).toBe( '<button type="button" id="button">OK</button>' );
  } );

  test( 'multiple instances', () => {
    const Button = vi.fn( ( props, children ) => {
      return [ 'button', { type: 'button', ...props }, ...children ];
    } );

    function template() {
      return [[
        [ Button, { id: 'first' }, 'hello' ],
        [ Button, { id: 'second' }, 'world' ],
      ]];
    }

    mount( template, document.body );

    expect( Button ).toHaveBeenCalledTimes( 2 );

    expect( document.body.innerHTML ).toBe( '<button type="button" id="first">hello</button><button type="button" id="second">world</button>' );
  } );

  test( 'onMount()', () => {
    const callback = vi.fn();

    function Button( props, children ) {
      onMount( callback );

      return [ 'button', { type: 'button', ...props }, ...children ];
    }

    function template() {
      return [ Button, { id: 'test' }, 'hello' ];
    }

    mount( template, document.body );

    expect( callback ).toHaveBeenCalledOnce();
  } );

  test( 'onDestroy()', () => {
    const callback = vi.fn();

    function Button( props, children ) {
      onDestroy( callback );

      return [ 'button', { type: 'button', ...props }, ...children ];
    }

    function template() {
      return [ Button, { id: 'test' }, 'hello' ];
    }

    const app = mount( template, document.body );

    expect( callback ).not.toHaveBeenCalled();

    app.destroy();

    expect( callback ).toHaveBeenCalledOnce();
  } );

  test( 'stop watching when destroyed', () => {
    const [ getValue, setValue ] = useState( 'apples' );

    const callback = vi.fn().mockImplementation( getValue );

    function Button( props, children ) {
      useReactive( callback );

      return [ 'button', { type: 'button', ...props }, ...children ];
    }

    function template() {
      return [ Button, { id: 'test' }, 'hello' ];
    }

    const app = mount( template, document.body );

    expect( callback ).toHaveBeenCalledOnce();

    app.destroy();

    callback.mockClear();

    setValue( 'oranges' );

    runSchedule();

    expect( callback ).not.toHaveBeenCalled();
  } );
} );
