import axios from 'axios';

import _ from "lodash";
import defaultState from "./InitState";

import EventEmitter from 'events'

import './WeNotify.sass'

export default class WeNotify extends EventEmitter {
    constructor(options = {}) {
        super();

        this.options = _.defaultsDeep(options, defaultState);

        this._onButtonClick();
        const self = this;

        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'WeNotifyWrapper');

        this.form = document.createElement('form');
        this.form.setAttribute('class', 'WeNotify');
        this.form.addEventListener('submit', this.onSubmit);

        this.form.prepend(this._header())
        this.form.appendChild(this._closeButton())
        this.form.appendChild(this._getInputs())
        this.form.appendChild(this._getButtons())

        this.wrapper.appendChild(this.form)

        this.initDisplayStyle = getComputedStyle(this.wrapper).display
    }

    _header() {
        return this._domStrParse(`<h3>${this.options.header}</h3>`)
    }

    _onButtonClick() {
        this.options.buttons.forEach(item => {
            const self = this;
            const itemClick = item.onClick;
            item.onClick = function(e) {
                e.preventDefault();
                self.emit(`${item.name}_click`);
               if(item.type === 'submit') {
                   itemClick && itemClick(e)
                   self.onSubmit(e);
               } else if(item.type === 'close') {
                   itemClick && itemClick(e)
                   self.close();
               } else if(item.type === 'unmount'){
                   itemClick && itemClick(e)
                   self.unmount();
               } else {
                   itemClick && itemClick(e)
               }
            };
        })
    }

    _domStrParse(str, attr) {
        const elem = new DOMParser().parseFromString(str, 'text/html').body.childNodes[0]
        attr && Object.keys(attr).forEach(item => {
            elem.setAttribute(item, attr[item])
        })
        return elem;
    }

    _closeButton() {
        const closeBtn = this._domStrParse(`<div class="close">&times;</div>`);
        closeBtn.addEventListener('click', this.close);
        return closeBtn
    }

    _getInputs() {
        const inputList = this.options.inputs.map(item => {
            let elemStr;
            const wrapper = this._domStrParse(`<div class="we-notify-input-wrapper"></div>`)
            if(item.type !== 'textarea') {
                elemStr = (`               
                    <input type="${item.type || 'text'}"
                           placeholder="${item.placeholder || item.name + '...'}"
                           name="${item.name}"
                    />
                `)
            } else {
                elemStr = (`
                        <textarea type="${item.type || 'text'}"
                                  placeholder="${item.placeholder || item.name + '...'}"
                                  name="${item.name}"
                        ></textarea>
                `)
            }
            const elem = this._domStrParse(elemStr, (item.className && {class: item.className}));
            item.label && wrapper.prepend(this._domStrParse(`<label>${item.label}</label>`))
            wrapper.append(elem)
            return wrapper;
        });

        const inputWrapper = this._domStrParse(`<div class="we-notify-content"></div>`);

        for(let i = 0; i < inputList.length; i++) {
            inputWrapper.appendChild(inputList[i])
        }

        return inputWrapper;
    }

    _getButtons() {
        const buttonList = this.options.buttons.map(item => {
            const button = this._domStrParse(`<button type="cancel">${item.label}</button>`, (item.className && {class: item.className}));
            item.onClick && button.addEventListener('click', item.onClick)
            return button;
        });

        const btnWrapper = this._domStrParse(
            `<div class="we-notify-buttons">
                <button type="submit" class="we-notify-submit-button">${this.options.submitButton.label}</button>
            </div>`
        );

        for(let i = 0; i < buttonList.length; i++) {
            btnWrapper.appendChild(buttonList[i])
        }

        return btnWrapper
    }

    close = () => {
        this.emit('before_close');
        this.wrapper.style.display = 'none';
        this.emit('after_close');
    }

    show = () => {
        this.emit('before_show');
        this.wrapper.style.display = this.initDisplayStyle;
        this.emit('after_show');
    }

    getData() {
        return this.options.inputs.map(item => {
            return {
                name: item.name,
                value: this.form[item.name] && this.form[item.name].value
            }
        });
    }

    _sendData(data) {
        const {sendData} = this.options;
        if(!sendData) return;

        return axios({
            url: sendData.url,
            method: sendData.method,
            data
        })
            .then(res => console.log(res.data))
            .catch(err => {
                this.emit('error', err)
            })
    }

    render(parentNode = this.options.parentNode) {
        this.options.parentNode = parentNode;
        try {
            parentNode.appendChild(this.wrapper);
            this.emit('after_render')
        } catch(e) {
            this.emit('error', e)
        }
    }

    unmount() {
        try {
            if(this.options.parentNode.contains(this.wrapper)) this.options.parentNode.removeChild(this.wrapper)
        } catch(e) {
            this.emit('error', e)
        }
    }

    onSubmit = (e) => { // Get inputs values from Component
        e.preventDefault();
        const inputValues = this.getData()
        this.emit('submit', inputValues)
        this._sendData(inputValues)
    }
}

// export default WeNotify;