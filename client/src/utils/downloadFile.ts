import {baseURL} from "../services/config";

export async function downloadFile(schedule: string, accessToken: string) {
    const response = await fetch(`${baseURL}/api/schedule/downloadFile?filePath=${schedule}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    if (response.status === 200) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = schedule.split('/')[schedule.split('/').length - 1]
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}