import { describe, expect, test } from 'vitest';
import { useState } from 'leaner';
import { make } from 'leaner/web/make.js';
import { runSchedule } from 'leaner/schedule.js';

describe( 'styles', () => {
  test( 'static value', () => {
    const element = make( [ 'button', { type: 'button', style: 'display: none;' } ] );

    expect( element.style.display ).toBe( 'none' );
  } );

  test( 'static object', () => {
    const element = make( [ 'button', { type: 'button', style: { display: 'none' } } ] );

    expect( element.style.display ).toBe( 'none' );
  } );

  test( 'dynamic value', () => {
    const [ value, setValue ] = useState( 'display: none;' );

    const element = make( [ 'button', { type: 'button', style: value } ] );

    expect( element.style.display ).toBe( 'none' );

    setValue( 'display: inline;' );

    runSchedule();

    expect( element.style.display ).toBe( 'inline' );
  } );

  test( 'dynamic object', () => {
    const [ value, setValue ] = useState( 'none' );

    const element = make( [ 'button', { type: 'button', style: { display: value } } ] );

    expect( element.style.display ).toBe( 'none' );

    setValue( 'inline' );

    runSchedule();

    expect( element.style.display ).toBe( 'inline' );
  } );

  // NOTE: custom properties cannot be tested because of https://github.com/jsdom/jsdom/issues/1895
} );
