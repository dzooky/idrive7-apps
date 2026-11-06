'use strict';

/**
 * Oil Service Assistant
 *
 * Initial UI shell styled to match the Warm-Up app.
 * Vehicle signals and service functions will be connected incrementally.
 */
const mgu = require('./kit/mgu');
const G = require('./kit/gauges');

const W = 1600, H = 520;

mgu.run({
    async start(ctx) {
        const { ui, log } = ctx;

        function render() {
            const t = ctx.theme();
            const cv = ctx.canvas(W, H).clear(t.bg);

            // Left: the same segmented temperature panel used by Warm-Up.
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

            // Right: service-assistance status panel, ready for live information.
            G.panel(cv, t, 928, 44, 648, 468, null);
            cv.roundRect(952, 70, 600, 60, 10, withAlpha(t.dim, 0.16));
            cv.text('WAITING FOR OIL DATA', 1252, 110, 32, t.dim, {
                align: 'center',
                font: 'bold',
                spacing: 2
            });
            cv.text('Vehicle data will appear here', 952, 190, 24, t.dim);
            cv.text('Oil Service Assistant', 952, 258, 34, t.text, { font: 'bold' });
            cv.text('Temperature monitoring and service assistance', 952, 300, 22, t.dim);

            G.frame(cv, t, ['Oil Service'], 0, []);
            return ui.image('MAIN_GFX', cv);
        }

        ctx.loop('MAIN', 4, render);
        render()
            .then(() => log.info('OSA first frame rendered'))
            .catch((e) => log.warn('OSA first render: ' + e));
    },
});
