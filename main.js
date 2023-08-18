let wrapper = document.createElement("div");
document.body.appendChild(wrapper);

let form = document.createElement("form");
form.style.display = "flex";
form.style.flexDirection = "column";
form.style.width = 30 + "%";

wrapper.appendChild(form);

let title = document.createElement("label");
title.textContent = "Title";
form.appendChild(title);

let inpTitle = document.createElement("input");
form.appendChild(inpTitle);

let type = document.createElement("label");
type.textContent = "Type";
form.appendChild(type);

let select = document.createElement("select");
form.appendChild(select);

let opt1 = document.createElement("option");
opt1.value = "movie";
opt1.textContent = "Movie";
select.appendChild(opt1);

let opt2 = document.createElement("option");
opt2.value = "series";
opt2.textContent = "Series";
select.appendChild(opt2);

let btn = document.createElement("button");
btn.textContent = "Search";
form.appendChild(btn);

let wrapAllFilms = document.createElement("div");
wrapAllFilms.style.display = "flex";
wrapAllFilms.style.flexWrap = "wrap";
document.body.appendChild(wrapAllFilms);

let pages = document.createElement("div");
document.body.appendChild(pages);

btn.addEventListener("click", (event) => {
    event.preventDefault();
    getData();
});

async function getData() {
    let name = inpTitle.value;
    let format = select.value;
    let resp = await fetch(`http://www.omdbapi.com/?apikey=cad92c22&s=${name}&type=${format}&page=${1}`);

    if (resp.ok) {
        let movies = await resp.json();
        let arrMovies = movies.Search;
        let totalObj = movies.totalResults;
        let totalResult = Math.ceil(totalObj / 10);

        pages.innerHTML = ''; // Очищаємо попередні сторінки

        for (let i = 1; i <= totalResult; i++) {
            let pageLink = document.createElement("a");
            pageLink.textContent = i;
            pageLink.href = `http://www.omdbapi.com/?apikey=cad92c22&s=${name}&type=${format}&page=${i}`;
            pages.appendChild(pageLink);

            pageLink.addEventListener("click", async function (event) {
                event.preventDefault();
                let pageNumber = i;
                let resp = await fetch(`http://www.omdbapi.com/?apikey=cad92c22&s=${name}&type=${format}&page=${pageNumber}`);
                let page = await resp.json();
                displayMovies(page.Search);
            });
        }

        displayMovies(arrMovies);
    }
}

function displayMovies(movies) {
    wrapAllFilms.innerHTML = ''; // Очищаємо попередні фільми

    movies.forEach(async (movie) => {
        let wrapFilm = document.createElement("div");

        let poster = document.createElement("img");
        poster.src = movie.Poster;
        poster.alt = movie.Title;
        wrapFilm.appendChild(poster);

        let nameMovie = document.createElement("h5");
        nameMovie.textContent = movie.Title;
        wrapFilm.appendChild(nameMovie);

        let yearMovie = document.createElement("p");
        yearMovie.textContent = movie.Year;
        wrapFilm.appendChild(yearMovie);

        let btnAbout = document.createElement("button");
        btnAbout.textContent = "About";
        wrapFilm.appendChild(btnAbout);

        btnAbout.addEventListener("click", async function () {
            let dellBlock = document.querySelector(".WrapperFilm");

            if (dellBlock) {
                document.body.removeChild(dellBlock);
            }

            var wrapAbout = document.createElement("div");
            wrapAbout.className = "WrapperFilm";
            document.body.appendChild(wrapAbout);

            let linkName = movie.Title;
            let linkFormat = movie.Type;

            let resp = await fetch(`http://www.omdbapi.com/?apikey=cad92c22&t=${linkName}&type=${linkFormat}`);

            if (resp.ok) {
                let infAboutFilm = await resp.json();

                let newName = infAboutFilm.Title;
                let newYear = infAboutFilm.Year;
                let textAbout = infAboutFilm.Plot;

                let imgPoster = document.createElement("img");
                imgPoster.src = infAboutFilm.Poster;
                wrapAbout.appendChild(imgPoster);

                let h4 = document.createElement("h4");
                h4.textContent = newName;
                wrapAbout.appendChild(h4);

                let yearStart = document.createElement("h5");
                yearStart.textContent = newYear;
                wrapAbout.appendChild(yearStart);

                let p = document.createElement("p");
                p.textContent = textAbout;
                wrapAbout.appendChild(p);

                let btnClose = document.createElement("button");
                btnClose.textContent = "Close";
                wrapAbout.appendChild(btnClose);

                btnClose.addEventListener("click", function () {
                    document.body.removeChild(wrapAbout);
                });
            }
        });

        wrapAllFilms.appendChild(wrapFilm);
    });
}
