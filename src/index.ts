import fs from 'fs'
import youtubeDl from 'youtube-dl-exec'
import converter from 'video-converter'
import pathToFfmpeg from 'ffmpeg-static'
import { range } from 'rambda'
import fsExtra from 'fs-extra'

converter.setFfmpegPath(pathToFfmpeg, () => {})

const files = {
    '11': '',
    '13': '',
    blocks: '',
    cat: '',
    chirp: '',
    far: '',
    mall: '',
    mellohi: '',
    stal: '',
    strad: '',
    wait: '',
    ward: '',
}

export const download = async (links: string[] /*  | Record<keyof typeof files, string> */) => {
    await fsExtra.emptyDir('.')
    const length = links.length
    let downloaded = 0
    await Promise.all(
        links.map((link, i) => {
            return (async () => {
                await youtubeDl(link, {
                    format: 'bestaudio',
                    output: `${Object.keys(files)[i]}.mp3`,
                })
                console.log(`downloaded ${++downloaded}/${length}`)
            })()
        }),
    )
    for (const i of range(0, length)) {
        console.log(`converting ${i}/${length}`)
        const mp3File = `${Object.keys(files)[i]}.mp3`
        await new Promise<void>(resolve => {
            converter.convert(mp3File, `${Object.keys(files)[i]}.ogg`, err => {
                if (err) throw err
                resolve()
            })
        })
        await fs.promises.unlink(mp3File)
    }
}
