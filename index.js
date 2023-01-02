const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "5804563077:AAGnk8NnwlemBa_TSF7X7tejoPgiDogjDMw"

const bot = new TelegramApi(token, {polling: true})

const chats = {}

// const againOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: 'Играть еще раз', callback_data: '/again'},]
//         ]
//     })
// }
//
// const gameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
//             [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
//             [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
//             [{text: '0', callback_data: '0'}],
//         ]
//     })
// }

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, а ты должен будешь ее угадать)`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о себе'},
        {command: '/game', description: 'Играть в "Угадай цифру"'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        switch (text){
            case '/start':
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/256/13.webp ')
                // await  bot.sendMessage(chatId, `Это приложения для облегчения работы по обработке всех недобросовестных направлений на КТ`)
                await  bot.sendMessage(chatId, `Это приложения для того, чтобы взбесить тебя) Нажимай играть!`)
                break
            case '/info':
                await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
                break
            case '/game':
                startGame(chatId)
                // await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, а ты должен будешь ее угадать)`)
                // const randomNumber = Math.floor(Math.random() * 10)
                // chats[chatId] = randomNumber
                // await bot.sendMessage(chatId, `Отгадай`, gameOptions)
                break
            default:
                bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еше раз!`)
        }
    })

    bot.on('callback_query', async msq => {
        const data = msq.data
        const chatId = msq.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/10.jpg')
           return  await bot.sendMessage(chatId, `Ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/1.jpg')
            return await bot.sendMessage(chatId, `Ты не угадал, была выбрана цифра ${chats[chatId]}`, againOptions)
        }
    })
}

start()