'use strict';

/**
 * Oil Service Assistant
 *
 * Initial application shell. Live vehicle signals and service functions
 * will be added incrementally after their availability is verified.
 */
const mgu = require('./kit/mgu');
const G = require('./kit/gauges');

const W = 1600, H = 520;

mgu.run({
    async start(ctx) {
        const { ui, log } = ctx;

        async function render() {
            const t = ctx.theme();
            const cv = ctx.canvas(W, H).clear(t.bg);

            G.frame(cv, t, ['Engine oil'], 0, []);
            G.panel(cv, t, 24, 72, 1552, 416, 'Oil temperature');

            cv.text('--', 72, 236, 104, t.dim, { font: 'num' });
            cv.text('°C', 238, 236, 34, t.dim);
            cv.text('LIVE DATA NOT CONNECTED', 72, 316, 22, t.dim, { font: 'bold', spacing: 1.5 });
            cv.text('Oil Service Assistant', 1528, 448, 22, t.accent, { align: 'right', font: 'bold' });

            await ui.image('MAIN_GFX', cv);
        }

        ctx.loop('MAIN', 10, render);
        render()
            .then(() => log.info('OSA first frame rendered'))
            .catch((e) => log.warn('OSA first render: ' + e));
    },
});
