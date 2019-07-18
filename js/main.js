"use strict";

const $listContainer = $('#list')

function mkLine({link, referal}) {
    return `<div class="list-row row">
                <div class="list-field url-field col-4">
                  ${link}
                </div>
                <div class=" list-field referal-field col-6">
                  ${referal}
                </div>
                <div class=" col-1">
                  <button class="btn btn-sm js-edit"><i class="fa fa-edit"></i></button>
                </div>
                <div class=" col-1">
                  <button class="btn btn-sm js-remove"><i class="fa fa-trash"></i></button>
                </div>
             </div>`
}

let Store = []

// заполняем лист
chrome.storage.sync.get(['links'], function (result) {
    Store = result.links || []
    Store.forEach(dt => {
        $listContainer.append(mkLine(dt))
    })
});

const
    $inpLink = $('#input-link'),
    $inpRef = $('#input-referal')

function validate() {
    let valid = true

    if (!$inpLink.val().match(/((?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)) {
        $inpLink.addClass('invalid')
        valid = false
    }

    if (!$inpRef.val()) {
        $inpRef.addClass('invalid')
        valid = false
    }

    return valid
}

$inpLink.on('focus', function() {
    $(this).removeClass('invalid')
})
$inpRef.on('focus', function() {
    $(this).removeClass('invalid')
})

$($listContainer).on('click','.js-remove', function() {
    const $self = $(this)
    Store.splice($self.index, 1)
    $self.hide(200)
    $self.detach()

    chrome.storage.sync.set({links: Store})
})

$('#add-btn').on('click', function () {
    if (!validate()) {
        return
    }

    const toStore = {
        link: $inpLink.val(),
        referal: $inpRef.val()
    }
    // добавляем новые данные в стор
    Store.push(toStore)
    $listContainer.append(mkLine(toStore))

    chrome.storage.sync.set({links: Store})
})
