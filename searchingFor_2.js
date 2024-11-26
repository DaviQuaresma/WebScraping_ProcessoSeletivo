const { default: puppeteer } = require("puppeteer");

const url = "https://www.mercadolivre.com.br/";
const searchFor = "Notebook";
let cont = 1

const list = []

async function searchingFor() {
  const browser = await puppeteer.launch({ headless: false }); // Resolve o browser
  const page = await browser.newPage(); // Cria a nova página
//   console.log("Abriu a página");

  await page.goto(url);
//   console.log("Entrei na página");

  await page.waitForSelector("#cb1-edit"); // Não precisa de await page aqui
//   console.log("Achou o seletor do campo de busca");

  await page.type("#cb1-edit", searchFor); // Digita no campo
//   console.log("Preencheu o campo de busca");

  await Promise.all([
    page.waitForNavigation(), // Espera a navegação concluir
    page.click(".nav-search-btn"), // Clica no botão de pesquisa
  ]);
//   console.log('Clicou no botão de busca')

  const links = await page.$$eval(
    "h2.poly-box.poly-component__title > a",
    (link) => link.map((el) => el.href) // Obtém o atributo href dos links
        // .filter((href) => href.includes("/dp/")) // Filtra apenas os links de produtos
  );
  console.log(`Pegou resultado das pesquisas: ${links.length}`)

  if (links.length === 0) {
    console.log("Nenhum link capturado")
    await browser.close()
    return
  }

  for (const link of links) {
    if (cont === 4) continue // limitando para testes rapidos
    // console.log(`Navegando para o link: ${link}`);
    console.log(`Estou na pagina ${cont}`)
        
  
    await page.goto(link);

    await page.waitForSelector(".ui-pdp-title"); // Usando o ID do elemento
    const title = await page.$eval(".ui-pdp-title", (el) => el.innerText);
    // console.log("Pegou o texto do título:", title);

    const priceSelector = ".andes-money-amount__fraction"; // Verificar o seletor correto para o preço
    const price = await page.$eval(priceSelector, (el) => el.innerText);
    // console.log("Pegou o texto do preço:", price);

    const seller = await page.evaluate(() => { // achar nome do vendedor
        const el = document.querySelector(".ui-seller-data-header__title-container > span")
        console.log("Achou o vendedor")
        if (!el) {
            return null
        } else {
            return el.innerText
        }
    })

    const log = {} // fazendo meu objeto do scrapping
    log.title = title
    log.price = price
    log.link = link
    seller ? (log.seller = seller) : ""

    list.push(log)
    cont++
  }
  console.log(list)

  await browser.close();
}

searchingFor();

