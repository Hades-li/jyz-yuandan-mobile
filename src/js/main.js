import '../css/main.scss'

!(function($,win) {
    // 弹窗函数
    const popup = ({content,type,popupWidth}) => {
        const $cover = $('.popup-cover')
        const $dom = $('.popup')
        // const width = popupWidth ? popupWidth : 250
        if (type === 'red') {
            $dom.addClass('red')
        } else {
            $dom.removeClass('red')
        }
        $dom.find('.popup-content').html(content)
        // $dom.css('width', width + 'px')
        $dom.show()
        $cover.addClass('open')

        $dom.find('.close').one('click', () => {
            $dom.hide()
            $cover.removeClass('open')
        })
    }

    const popup_pig = (type) => {
        const $cover = $('.popup-cover')
        const $dom = $('.popup-pig')
        if (type === 'red') {
            $dom.addClass('red')
        } else {
            $dom.removeClass('red')
        }
        $dom.show()
        $cover.addClass('open')

        $dom.find('.close').one('click', () => {
            $dom.hide()
            $cover.removeClass('open')
        })
    }

    win.popup = popup
    win.popup_pig = popup_pig

})(jQuery, window)





