/*! Snow Effect by Selezen v1.0.0 | MIT License */
/*!Created by Selezen, © 2024*/

(function() {
    'use strict';

    /**
     * Чекаємо наявності jQuery. Якщо його немає - довантажуємо з cdnjs.
     * Після завантаження jQuery викликаємо колбек initSnowEffect.
     */
    function waitForJQuery(callback) {
        if (window.jQuery) {
            callback(window.jQuery);
        } else {
            var script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => callback(window.jQuery);
            document.head.appendChild(script);
        }
    }

    /**
     * Функція ініціалізації снігового ефекту і його методи start/stop/init.
    */
    function initSnowEffect(jQuery) {
        var $ = jQuery;
        var isRunning = false;
        let activeSnowflakes = 0;
        const MAX_SNOWFLAKES = 100;

        const defaultSettings = {
            character: "❄",
            speed: 40000,
            frequency: 500,
            color: "#Fa0000",
            blur: false,
            enabled: true,
            small: 16,
            large: 32,
            wind: 100,
            windVariance: 50,
            startOpacity: 1,
            endOpacity: 0,
            overflow: "hidden",
            zIndex: 9999
        };

        window.SnowEffect = {
            settings: {...defaultSettings},
            
            init: async function(scriptUrl) {
                if (scriptUrl) {
                    try {
                        const response = await fetch(scriptUrl);
                        const data = await response.json();
                        
                        // Застосовуємо тільки валідні налаштування
                        for (const [key, value] of Object.entries(data)) {
                            if (value !== undefined && value !== null && defaultSettings.hasOwnProperty(key)) {
                                this.settings[key] = value;
                            }
                        }
                    } catch (error) {
                        console.warn('Ошибка загрузки настроек:', error);
                    }
                }

                // Запускаємо або зупиняємо ефект після оновлення налаштувань
                if (this.settings.enabled && !isRunning) {
                    this.start();
                } else if (!this.settings.enabled && isRunning) {
                    this.stop();
                }
            },

            start: function() {
                if (isRunning) {
                    this.stop(); // Перезапускаємо з новими налаштуваннями
                }
                
                isRunning = true;
                activeSnowflakes = 0;

                const $container = $('<div>')
                    .addClass('snow-container')
                    .css({
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        overflow: this.settings.overflow,
                        zIndex: this.settings.zIndex
                    })
                    .appendTo('body');

                const createFlake = () => {
                    if (!isRunning || activeSnowflakes >= MAX_SNOWFLAKES) return;

                    activeSnowflakes++;
                    const fontSize = Math.random() * (this.settings.large - this.settings.small) + this.settings.small;
                    const startX = Math.random() * window.innerWidth;
                    const windOffset = (Math.random() - 0.5) * this.settings.wind;
                    const endY = window.innerHeight + fontSize;
                    
                    const $flake = $('<span>')
                        .html(this.settings.character)
                        .css({
                            position: 'absolute',
                            top: -fontSize,
                            left: startX,
                            color: this.settings.color,
                            fontSize: fontSize + 'px',
                            opacity: this.settings.startOpacity,
                            transition: `all ${this.settings.speed/1000}s linear`
                        })
                        .appendTo($container);

                    requestAnimationFrame(() => {
                        $flake.css({
                            transform: `translate(${windOffset}px, ${endY}px)`,
                            opacity: this.settings.endOpacity
                        });
                    });

                    setTimeout(() => {
                        activeSnowflakes--;
                        $flake.remove();
                    }, this.settings.speed);
                };

                const generateFlakes = () => {
                    if (isRunning) {
                        createFlake();
                        setTimeout(generateFlakes, this.settings.frequency);
                    }
                };

                generateFlakes();
            },

            stop: function() {
                isRunning = false;
                $('.snow-container').remove();
                activeSnowflakes = 0;
            }
        };

        // URL вашего Google Apps Script (Web App)
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXDc1zV88D0nJxYtc3KoPn6WTiG9qIo2zlo9RSccHi7cpEMMFireralBh3q6p-5uVDLA/exec';
        
        // Ініціалізація + періодичне оновлення налаштувань
        window.SnowEffect.init(GOOGLE_SCRIPT_URL);
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                window.SnowEffect.init(GOOGLE_SCRIPT_URL);
            }
        }, 5000);
    }

    /**
     * Запускаємо основний код скрипта за подією DOMContentLoaded,
     * щоб гарантовано працювати за місцем «підключення як CDN».
     */
    window.addEventListener('DOMContentLoaded', function() {
        waitForJQuery(initSnowEffect);
    });
})();

