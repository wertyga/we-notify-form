

import WeNotify from 'we-notify-form'

const wrapper = document.getElementById('app')

const notify = new WeNotify({
    inputs: [
        {
            name: 'username',
            label: 'Username'
        },
        {
            name: 'password',
            type: 'password',
            label: 'Password'
        },
        {
            name: 'surname',
            label: 'Surname'
        },
        {
            name: 'message',
            type: 'textarea',
            label: 'Message'
        }
    ],
    buttons: [
        {
            name: 'cancel',
            type: 'close',
            label: 'Cancel',
            onClick(e) {
                console.log(e.target)
                console.log('Cancel')
            }
        },
        {
            name: 'get_info',
            label: 'Get info',
            onClick(e) {
                console.log(e.target)
                console.log('get_info')
            }
        }
    ]
});

const notify2 = new WeNotify({})


const btnS = new DOMParser().parseFromString('<button>SHOW</button>', 'text/html').body.childNodes[0]
const btnC = new DOMParser().parseFromString('<button>CLOSE</button>', 'text/html').body.childNodes[0]
const btnU = new DOMParser().parseFromString('<button>UNMOUNT</button>', 'text/html').body.childNodes[0]
const btnM = new DOMParser().parseFromString('<button>MOUNT</button>', 'text/html').body.childNodes[0]
const btnSB = new DOMParser().parseFromString('<button>SUBMIT</button>', 'text/html').body.childNodes[0]
btnS.addEventListener('click', show)
btnC.addEventListener('click', close)
btnU.addEventListener('click', unmount)
btnM.addEventListener('click', mount)
btnSB.addEventListener('click', submit)

wrapper.appendChild(btnS)
wrapper.appendChild(btnC)
wrapper.appendChild(btnU)
wrapper.appendChild(btnM)
wrapper.appendChild(btnSB)

function mount(e) {
    notify.render(wrapper)
}
function show(e) {
    notify.show()
}
function close(e) {
    notify.close()
}
function unmount(e) {
    notify.unmount()
}
function submit(e) {
    notify.onSubmit(e)
}


notify.render(wrapper)


