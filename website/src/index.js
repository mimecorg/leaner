import { handleFocusVisible, trapFocus, untrapFocus } from './utils/focus';

window.addEventListener( 'DOMContentLoaded', () => {
  handleFocusVisible();
  handleOptions();

  if ( document.body.classList.contains( 'with-sidebar' ) ) {
    handleSidebar();
    handleToc();
  }
} );

function handleOptions() {
  const toggleTheme = document.getElementById( 'toggle-theme' );
  if ( toggleTheme != null ) {
    const tooltip = toggleTheme.querySelector( 'span' );

    if ( document.documentElement.classList.contains( 'dark' ) )
      tooltip.textContent = 'Light mode';

    toggleTheme.addEventListener( 'click', () => {
      const theme = document.documentElement.classList.toggle( 'dark' ) ? 'dark' : 'light';
      if ( theme == 'dark' )
        tooltip.textContent = 'Light mode';
      else
        tooltip.textContent = 'Dark mode';
      localStorage.setItem( 'theme', theme );
    } );
  }

  const toggleSize = document.getElementById( 'toggle-size' );
  if ( toggleSize != null ) {
    toggleSize.addEventListener( 'click', () => {
      const size = document.documentElement.classList.toggle( 'font-size-lg' ) ? 'lg' : 'normal';
      localStorage.setItem( 'font-size', size );
    } );
  }
}

function handleSidebar() {
  const sidebar = document.querySelector( '.sidebar' );

  document.getElementById( 'show-menu' ).addEventListener( 'click', openSidebar );
  document.getElementById( 'hide-menu' ).addEventListener( 'click', closeSidebar );

  sidebar.addEventListener( 'keydown', e => {
    if ( e.keyCode == 27 )
      closeSidebar();
  } );

  sidebar.addEventListener( 'click', e => {
    if ( e.target == sidebar || e.target.tagName == 'A' )
      closeSidebar();
  } );

  sidebar.addEventListener( 'transitionend', () => {
    if ( !document.body.classList.contains( 'sidebar-fade' ) )
      document.body.classList.remove( 'sidebar-open' );
  } );

  function openSidebar() {
    document.body.classList.add( 'sidebar-open' );
    trapFocus( sidebar );
    setTimeout( () => {
      document.body.classList.add( 'sidebar-fade' );
    }, 0 );
  }

  function closeSidebar() {
    document.body.classList.remove( 'sidebar-fade' );
    untrapFocus( sidebar );
  }
}

function handleToc() {
  const links = document.querySelectorAll( '.sidebar .is-active li' );

  if ( links.length == 0 )
    return;

  const headings = document.querySelectorAll( '.content h3' );

  let last = null;

  highlight();

  window.addEventListener( 'scroll', highlight );

  function highlight() {
    const padding = 1.5 * parseFloat( getComputedStyle( document.documentElement ).scrollPaddingTop );

    const top = window.scrollY;

    let active = null;

    for ( let i = headings.length - 1; i >= 0; i-- ) {
      if ( top >= ( headings[ i ].offsetTop - padding ) || top >= document.body.clientHeight - window.innerHeight ) {
        active = links[ i ];
        break;
      }
    }

    if ( active != last ) {
      if ( last != null )
        last.classList.remove( 'is-active' );
      if ( active != null )
        active.classList.add( 'is-active' );
      last = active;
    }
  }
}
