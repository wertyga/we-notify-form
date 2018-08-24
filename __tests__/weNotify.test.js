import chai from 'chai';

import Notify from '../WeNotifyForm/WeNotify';
import initData from '../WeNotifyForm/InitState';

const $ = require('jquery');
import {server} from '../server/index';

chai.use(require('chai-http'));


describe('[X] WeNotify construct', function() {
    it('# Init with empty options', function(done) {
        const notify = new Notify({});
        expect(notify.options).toEqual(initData);

        done();
    })
    it('# Init with custom options', function(done) {
        const customOpt = {
            sendData: {
                url: '/someUrl',
                method: 'post'
            },
            inputs: [
                {
                    name: 'one',
                    type: 'textarea'

                },
                {
                    name: 'another',
                    type: 'textarea'
                }
            ],
            buttons: [
                {
                    name: 'closeButton',
                    label: 'closeButton'
                }
            ],
            submitButton: {
                label: 'test'
            }
        };
        const notify = new Notify(customOpt);

        expect(notify.options.buttons.length).toEqual(1);
        expect(notify.options.inputs.length).toEqual(2);
        expect(notify.options.submitButton.name).toEqual(initData.submitButton.name);
        expect(notify.options.submitButton.type).toEqual(initData.submitButton.type);
        expect(notify.options.submitButton.label).toEqual(customOpt.submitButton.label);

        done();
    })
});

describe('[X] API', function() {
    const defaultNotify = new Notify({});
    const customNotify = new Notify({
        inputs: [
            {
                name: 'input1',
            },
            {
                name: 'input2'
            }
        ],
        buttons: [
            {
                name: 'button1',
                onClick(e) {
                    return 'button1'
                }
            },
            {
                name: 'button2',
                onClick(e) {
                    return 'button2'
                }
            }
        ]
    });

    beforeAll((done) => {
        document.body.innerHTML = (
            `<div id="app">
                <div id="first"></div>
                <div id="second"></div>
            </div>`
        );
        done()
    })
    it('# Render', function(done) {
        defaultNotify.render(document.getElementById('first'))

        expect($('.WeNotifyWrapper').length).toEqual(1)
        expect($('.WeNotify').length).toEqual(1)
        expect($('.WeNotify input').length).toEqual(1)
        expect($('.WeNotify textarea').length).toEqual(1)
        expect($('.WeNotify button').length).toEqual(1)

        customNotify.render(document.getElementById('second'))

        expect($('.WeNotifyWrapper').length).toEqual(2)
        expect($('.WeNotify').length).toEqual(2)
        expect($('.WeNotify input').length).toEqual(2)
        expect($('.WeNotify textarea').length).toEqual(2)

        expect($('#second .WeNotifyWrapper').length).toEqual(1)
        expect($('#second .WeNotify').length).toEqual(1)
        expect($('#second .WeNotify input').length).toEqual(1)
        expect($('#second .WeNotify textarea').length).toEqual(1)
        expect($('#second .WeNotify button').length).toEqual(3)

        done();
    });

    it('# Show-close', function(done) {
        defaultNotify.render(document.getElementById('first'))
        defaultNotify.close();

        expect($('#first .WeNotifyWrapper').length).toEqual(1)
        expect($('#first .WeNotifyWrapper')[0].style.display).toEqual('none')

        defaultNotify.show();
        expect($('#first .WeNotifyWrapper')[0].style.display).not.toEqual('none')

        done();
    });

    it('# Unmount', function (done) {
        defaultNotify.unmount();
        customNotify.unmount();
        expect($('#first .WeNotifyWrapper').length).toEqual(0)
        expect($('#second .WeNotifyWrapper').length).toEqual(0)
        expect($('#first').html()).toEqual('')
        expect($('#second').html()).toEqual('')

        done();
    });

    it('# Submit', function(done) {
        const data = [
            {
                name: 'username',
                value: 'testUsername',
             },
            {
                name: 'message',
                value: 'testMessage'
            }
        ]
        chai.request(server)
            .post('/submit')
            .send(data)
            .end((err, res) => {
                expect(res.body).toEqual(data)

                done();
            })
    })
});