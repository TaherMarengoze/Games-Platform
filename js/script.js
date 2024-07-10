const baseUrl = 'https://free-to-play-games-database.p.rapidapi.com/api/';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'a01d6f48e6msh7c36ff53dd99c27p14dd7djsn2d7ff384cfd5',
        'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
    }
};

$(function(){

    showLoader();
    getGamesByCategory($('.games .nav-item .nav-link.active').text().toLowerCase());

    $('.games .nav-item').on('click', function() {
        $('.games .nav-item .nav-link').removeClass('active');
        $(this).children().addClass('active');

        showLoader();
        getGamesByCategory($(this).children().text().toLowerCase());
    })

    $('#btnClose').on('click', function(){
        $('section.details').addClass('d-none');
        $('section.games').removeClass('d-none');
    })

});

/**
 * 
 * @param {string} category 
 */
async function getGamesByCategory(category) {
    try {
        const response = await fetch(`${baseUrl}games?category=${category}`, options);
        const result = await response.json();
        //console.log(result);
        displayGamesResult(result);
        hideLoader();

    } catch (error) {
        console.error(error);
    }
}

function displayGamesResult(games) {

    const gamesShowcase = $('#gamesShowcase');

    gamesShowcase.html("");
    for (let i = 0; i < games.length; i++) {
        const game = games[i];

        $('#gamesShowcase').append(createUnitCard(game));
    }
}

function createUnitCard(gameData) {
    const cardHtml = `
        <div class="col">
            <div class="card bg-transparent"
                 data-id="${gameData.id}"
                 onclick="showGameDetails(this)">

                <div class="card-body">
                    <figure>
                        <img src="${gameData.thumbnail}"
                             alt="game thumbnail" class="card-img-top h-100 object-fit-cover" />
                    </figure>
                    <figcaption>
                        <div class="d-flex justify-content-between align-items-center" >
                            <h3 class="text-white small">${gameData.title}</h3>
                            <span class="badge text-bg-primary">Free</span>
                        </div>
                        <p class="text-center text-white-50 small lh-1">
                            ${gameData.short_description}
                        </p>
                    </figcaption>
                </div>

                <footer class="card-footer d-flex justify-content-between">
                    <span class="badge bg-secondary">${gameData.genre}</span>
                    <span class="badge bg-secondary">${gameData.platform}</span>
                </footer>

            </div>
        </div>
    `;

    return cardHtml;
}

/**
 * 
 * @param {Element} eventSource Event-triggering object
 */
function showGameDetails(eventSource) {
    const gameId = eventSource.dataset.id;

    showLoader();
    getGameById(gameId);
}

async function getGameById(gameId) {
    try {
        const response = await fetch(`${baseUrl}game?id=${gameId}`, options);
        const result = await response.json();
        //console.log(result);

        displayGameDetails(result);

        //hide games showcase
        $('section.games').addClass('d-none');
        $('section.details').removeClass('d-none');
        hideLoader();

    } catch (error) {
        console.error(error);
    }
}

function displayGameDetails(game){
    $('section.details .body img').attr('src', game.thumbnail);

    $('section.details .body h3').html(game.title)
    .next().children('span').html(game.genre)
    .parent().next().children('span').html(game.platform)
    .parent().next().children('span').html(game.status)
    .parent().next().html(game.description)
    .next('a').attr('href', game.game_url);
}

function showLoader(){
    $('.loading').removeClass('d-none');
}

function hideLoader(){
    $('.loading').addClass('d-none');
}