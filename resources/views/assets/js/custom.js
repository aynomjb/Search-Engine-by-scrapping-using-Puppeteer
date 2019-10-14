
$(document).ready(function() {
    $('#searchForm').on('submit', function(e) {
        e.preventDefault()
    })
    $('#searchButton').on('click', function() {
        $('#searchBar').blur()
        $('#result-status').html('')
        $('#result-status2').html('')
        if ($('#tp').prop('checked') || $('#ts').prop('checked')) {
            submitSearch()
        }
    })
    $('#searchBar').on('focus', function() {
        $('#result-area').html('')
        $('#result-status').html('')
        $('#result-status2').html('')
        $('.search-area').removeClass('search-area-reduced')
    })
})

function submitSearch() {
    let c = 0
    let cc = $('.checkbox-filter:checked').length
    if ($('#searchBar').val() != '') {

        $('#result-status2').html(`<div> / Searching..... </div>`)
        $('#result-area').html(`    <div class="loading" id="loading-loader">
            <div class="loader"></div>
        </div>`)

        if ($('#tp').prop('checked')) {

            searchInTrustPilot($('#searchBar').val(), (res) => {
                if (res.success) {
                    c++
                    checkIfSearchIsComplete(c, cc)
                    if (res.data.success) {
                        console.log(res.data.data)
                        $('#result-status').append(`<div > / <span class="text-success">TrustPilot</span> 1 results &nbsp;</div>`)
                        let el = res.data.data
                        let reviewCount
                        if ('Reviews Count' in el) {
                            if (el['Reviews Count'] == '0') {
                                reviewCount = 0
                            } else {
                                reviewCount = el['Reviews Count'].split(' ')[0]
                            }
                        }
                        let ratings
                        let ratingStars
                        if ('Rating in stars and rating score' in el) {
                            ratings = `${el['Rating in stars and rating score'].split(' ')[0]}/${el['Rating in stars and rating score'].split(' ')[3]}`
                            ratingStars = getStars(el['Rating in stars and rating score'].split(' ')[0], el['Rating in stars and rating score'].split(' ')[3])
                        }
                        let domainImage
                        if ('Domain-Image' in el) {
                            domainImage = el['Domain-Image']
                        }
                        $('#result-area').prepend(`<div class="single-result">
            <div class="result-content">
                <div >
                   <div class="domain-image"><img src="${domainImage}"></div>
                </div>
                <div class="text-area-result">
                    <div><strong>${el['Domain Name']}</strong> in <strong class="text-success">TrustPilot</strong>
                    </div>
                    <div>
                        <span><Strong>Reviews</strong> - ${reviewCount } <strong> &nbsp;Claimed</strong> - ${el['Claimed (YES/NO)']=='Claimed'?'YES':'NO'} </span>
                    </div>
                    <div>${ratingStars} ${ratings} <strong> &nbsp; Category</strong> - ${el['category']} </div>
                    <div>
                        <strong>Description</strong>: ${el['Description']}
                    </div>
                </div>
            </div>
        </div>`)
                    } else {
                        $('#result-status').append(`<div > / <span class="text-success">TrustPilot</span> 0 results &nbsp;</div>`)
                    }
                }
            })
        }

        if ($('#ts').prop('checked')) {

            searchInTrustedShops($('#searchBar').val(), (res) => {

                if (res.success) {
                    c++
                    checkIfSearchIsComplete(c, cc)
                    if (res.data.success) {
                        console.log(res.data.data)
                        $('#result-status').append(`<div > / <span class="text-info">TrustedShops</span> 1 results &nbsp;</div>`)
                        let el = res.data.data
                        let reviewCount
                        if ('Reviews Count' in el) {
                            
                            el['Reviews Count'] = el['Reviews Count'].replace('Bewertungen gesammelt.','')
                            el['Reviews Count'] = el['Reviews Count'].replace('avis.','')
                            el['Reviews Count'] = el['Reviews Count'].trim()
                            let splited = el['Reviews Count'].split(' ')
                            reviewCount = splited[splited.length - 1].replace('.',',')
                        }
                        let ratings
                        let ratingStars
                        if ('Rating in stars and rating score' in el) {
                            ratings = el['Rating in stars and rating score']
                            ratingStars = getStars(ratings.split('/')[0], ratings.split('/')[1])
                        }
                        $('#result-area').prepend(`<div class="single-result">
            <div class="result-content">
                <div >
                   <div class="domain-image"><img src="${el['Domain-Image']}"></div>
                </div>
                <div class="text-area-result">
                    <div> <strong>${el['Shop Name']}</strong> in <strong class="text-info"> TrustedShops</strong>
                    </div>
                    <div>
                        <span><Strong>Reviews</strong> - ${reviewCount}  <strong>Certificate Vlid Till Date</strong> - ${el['Certificate Vlid Till Date']}  </span>
                    </div>
                    <div> ${ratingStars} ${ratings}  <strong> Category</strong> - ${el['category']} </div>
                    <div>
                        <strong>Description</strong>: ${el['Description']}
                    </div>
                </div>
            </div>
        </div>`)
                    } else {
                        $('#result-status').append(`<div > / <span class="text-info">TrustedShops</span> 0 results &nbsp;</div>`)
                    }
                }
            })
        }
        $('.search-area').addClass('search-area-reduced')
        $('.result-area').removeClass('d-none')
    }
}
async function searchInTrustPilot(query, cb) {
    let response = await fetch('/api/searchInTrustPilot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })

    })
    response.json().then((data) => {
        cb({
            success: true,
            data: data
        })
    })
}
async function searchInTrustedShops(query, cb) {
  
    let response = await fetch('/api/searchInTrustedShops', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
   
    })
    response.json().then((data) => {
        cb({
            success: true,
            data: data
        })
    })
}

function getStars(score, totalScore) {
    let ratingStars = `<span class="text-warning">`
    for (let j = 1; j < score; j++) {
        ratingStars = ratingStars + `<i class="fa fa-star" aria-hidden="true"></i> `
    }
    if ((score / 1) % 1 != 0) {
        ratingStars = ratingStars + `<i class="fa fa-star-half-o" aria-hidden="true"></i> `
        for (let j = 0; j < (totalScore - 1) - score; j++) {
            ratingStars = ratingStars + `<i class="fa fa-star-o" aria-hidden="true"></i> `
        }
    } else {
        for (let j = 0; j < totalScore - 1 - score; j++) {
            ratingStars = ratingStars + `<i class="fa fa-star-o" aria-hidden="true"></i> `
        }
    }
    ratingStars = ratingStars + `</span>`
    return ratingStars
}

function checkIfSearchIsComplete(c, cc) {
    if (c == cc) $('#result-status2').html('')
    $('#loading-loader').remove()
}