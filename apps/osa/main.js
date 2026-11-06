'use strict';

/**
 * Oil Service Assistant
 *
 * Two-page UI shell styled to match Warm-Up.
 * Vehicle signals and service functions will be connected incrementally.
 */
const mgu = require('./kit/mgu');
const G = require('./kit/gauges');
const { withAlpha } = require('./kit/canvas');

const W = 1600, H = 520;

mgu.run({
    async start(ctx) {
        const { ui, log } = ctx;
        let page = 0;

        function render() {
            const t = ctx.theme();
            const cv = ctx.canvas(W, H).clear(t.bg);

            if (page === 0) {
                // ENGINE page
                G.segBar(cv, t, 24, 44, 880, 468, {
                    label: 'Engine oil',
                    value: null,
                    unit: '°C',
                    decimals: 0,
                    min: 0,
                    max: 150,
                    step: 10,
                    scale: { every: 25 },
                    zones: [
                        { from: 120, to: 135, color: 'warn' },
                        { from: 135, to: 150, color: 'crit' }
                    ],
                    ramp: 'hot',
                    limit: 120
                });

                G.panel(cv, t, 928, 44, 648, 468, null);
                cv.roundRect(952, 70, 600, 60, 10, withAlpha(t.dim, 0.16));
                cv.text('WAITING FOR OIL DATA', 1252, 110, 32, t.dim, {
                    align: 'center', font: 'bold', spacing: 2
                });
                cv.text('Engine oil temperature', 952, 190, 24, t.dim);
                cv.text('Oil Service Assistant', 952, 258, 34, t.text, { font: 'bold' });
                cv.text('Temperature monitoring and service assistance', 952, 300, 22, t.dim);
            } else {
                // TRANSMISSION page
                G.segBar(cv, t, 24, 44, 880, 468, {
                    label: 'Transmission oil',
                    value: null,
                    unit: '°C',
                    decimals: 0,
                    min: 0,
                    max: 150,
                    step: 10,
                    scale: { every: 25 },
                    zones: [
                        { from: 90, to: 110, color: 'warn' },
                        { from: 110, to: 150, color: 'crit' }
                    ],
                    ramp: 'hot',
                    limit: 110
                });

                G.panel(cv, t, 928, 44, 648, 468, null);
                cv.roundRect(952, 70, 600, 60, 10, withAlpha(t.dim, 0.16));
                cv.text('WAITING FOR TRANSMISSION DATA', 1252, 110, 29, t.dim, {
                    align: 'center', font: 'bold', spacing: 1.5
                });
                cv.text('Transmission temperature', 952, 190, 24, t.dim);
                cv.text('ZF 8HP service assistance', 952, 258, 34, t.text, { font: 'bold' });
                cv.text('Temperature and service-procedure readiness', 952, 300, 22, t.dim);
            }

            G.frame(cv, t, ['Engine', 'Transmission'], page, []);
            return ui.image('MAIN_GFX', cv);
        }

        const switchPage = (next) => {
            page = next;
            ui.text('BTN_PAGE', page === 0 ? 'Transmission' : 'Engine');
            ui.text('BTN_PREV', page === 0 ? 'Transmission' : 'Engine');
            return render();
        };

        ui.onClick('BTN_PAGE', () => switchPage(1 - page));
        ui.onClick('BTN_PREV', () => switchPage(1 - page));
        ctx.onTab((i) => i !== page && switchPage(i));

        ctx.loop('MAIN', 4, render);
        render()
            .then(() => log.info('OSA first frame rendered'))
            .catch((e) => log.warn('OSA first render: ' + e));
    },
});
