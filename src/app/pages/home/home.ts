import { Component, AfterViewInit } from '@angular/core';

declare var AOS: any;
declare var GLightbox: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements AfterViewInit {

  ngAfterViewInit(): void {

    /**
     * Scroll do header
     */
    function toggleScrolled() {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');

      if (!selectHeader) return;

      if (
        !selectHeader.classList.contains('scroll-up-sticky') &&
        !selectHeader.classList.contains('sticky-top') &&
        !selectHeader.classList.contains('fixed-top')
      ) return;

      window.scrollY > 100
        ? selectBody?.classList.add('scrolled')
        : selectBody?.classList.remove('scrolled');
    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    /**
     * Mobile menu
     */
    const mobileNavToggleBtn: any = document.querySelector('.mobile-nav-toggle');

    function mobileNavToggle() {
      document.querySelector('body')?.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn?.classList.toggle('bi-list');
      mobileNavToggleBtn?.classList.toggle('bi-x');
    }

    mobileNavToggleBtn?.addEventListener('click', mobileNavToggle);

    /**
     * Fechar menu mobile ao clicar
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToggle();
        }
      });
    });

    /**
     * Scroll top
     */
    const scrollTop: any = document.querySelector('.scroll-top');

    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100
          ? scrollTop.classList.add('active')
          : scrollTop.classList.remove('active');
      }
    }

    scrollTop?.addEventListener('click', (e: any) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    /**
     * AOS Animation
     */
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    /**
     * GLightbox
     */
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox'
      });
    }

  }
}