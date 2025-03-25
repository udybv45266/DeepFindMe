'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Copy, ArrowDownUp, FileUp, Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Base64Converter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [mode, setMode] = useState<'encode' | 'decode'>('encode')
    const [fileName, setFileName] = useState('')

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'encode' ? 'decode' : 'encode'))
        setInput('')
        setOutput('')
        setFileName('')
    }

    const handleTabChange = (value: string) => {
        setInput('')
        setOutput('')
        setFileName('')
        console.log(`Switched to ${value} tab`)
    }

    const handleConvert = () => {
        try {
            if (mode === 'encode') {
                const encoded = btoa(input)
                setOutput(encoded)
                toast({
                    title: "Success",
                    description: "Text encoded to Base64",
                })
            } else {
                const decoded = atob(input)
                setOutput(decoded)
                toast({
                    title: "Success",
                    description: "Base64 decoded to text",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: mode === 'encode'
                    ? "Failed to encode text"
                    : "Invalid Base64 string",
                variant: 'destructive',
            })
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output)
            toast({
                title: "Copied!",
                description: "Content copied to clipboard",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy to clipboard",
                variant: 'destructive',
            })
        }
    }

    const handleFileEncode = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64String = event.target?.result as string
                const encoded = base64String.split(',')[1]
                setOutput(encoded)
                setFileName(file.name)
                toast({
                    title: "Success",
                    description: "File encoded to Base64",
                })
            }
            reader.readAsDataURL(file)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to encode file",
                variant: 'destructive',
            })
        }
    }

    const handleFileUploadForDecode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const reader = new FileReader()
            reader.onload = (event) => {
                const content = event.target?.result as string
                setInput(content)
                toast({
                    title: "Success",
                    description: "Base64 file loaded successfully",
                })
            }
            reader.readAsText(file)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to read Base64 file",
                variant: 'destructive',
            })
        }
    }

    const handleFileDecode = () => {
        try {
            const byteCharacters = atob(input)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray])

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName || 'decoded-file'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast({
                title: "Success",
                description: "Base64 decoded and downloaded",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid Base64 string",
                variant: 'destructive',
            })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">
                Base64 Converter
            </h1>
            <p className="text-xl mb-8 text-center text-gray-300">
                Encode and decode text/files using Base64 encoding.
            </p>
            <Card className="max-w-2xl mx-auto bg-black bg-opacity-50 border border-cyan-500">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-cyan-400">
                        <Tabs defaultValue="text" className="w-full" onValueChange={handleTabChange}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="text">Text</TabsTrigger>
                                <TabsTrigger value="file">File</TabsTrigger>
                            </TabsList>

                            <TabsContent value="text">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>{mode === 'encode' ? 'Text → Base64' : 'Base64 → Text'}</span>
                                        <Button
                                            onClick={toggleMode}
                                            variant="outline"
                                            className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                                        >
                                            <ArrowDownUp className="w-4 h-4 mr-2" />
                                            Switch Mode
                                        </Button>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">
                                            Input {mode === 'encode' ? 'Text' : 'Base64'}:
                                        </label>
                                        <Textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={mode === 'encode' ? "Enter text to encode" : "Enter Base64 to decode"}
                                            className="h-32 bg-gray-800 border-cyan-600 text-white"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleConvert}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                                        disabled={!input}
                                    >
                                        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                                    </Button>

                                    {output && (
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">
                                                Output {mode === 'encode' ? 'Base64' : 'Text'}:
                                            </label>
                                            <div className="relative">
                                                <Textarea
                                                    value={output}
                                                    readOnly
                                                    className="h-32 bg-gray-800 border-cyan-600 text-white"
                                                />
                                                <Button
                                                    onClick={handleCopy}
                                                    variant="outline"
                                                    className="absolute top-2 right-2 h-8 w-8 p-0 border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="file">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-cyan-400 font-semibold">
                                            {mode === 'encode' ? 'File → Base64' : 'Base64 → File'}
                                        </span>
                                        <Button
                                            onClick={toggleMode}
                                            variant="outline"
                                            className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                                        >
                                            <ArrowDownUp className="w-4 h-4 mr-2" />
                                            Switch Mode
                                        </Button>
                                    </div>

                                    {mode === 'encode' ? (
                                        <div className="flex justify-center p-6 border-2 border-dashed border-cyan-500 rounded-lg">
                                            <input
                                                type="file"
                                                onChange={handleFileEncode}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                <FileUp className="w-8 h-8 text-cyan-400" />
                                                <span className="mt-2 text-sm text-gray-400">
                                                    Select a file to encode
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Tabs defaultValue="paste" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="paste">Paste Base64</TabsTrigger>
                                                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="paste">
                                                    <Textarea
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        placeholder="Paste Base64 string to decode"
                                                        className="h-32 bg-gray-800 border-cyan-600 text-white"
                                                    />
                                                </TabsContent>

                                                <TabsContent value="upload">
                                                    <div className="flex justify-center p-6 border-2 border-dashed border-cyan-500 rounded-lg">
                                                        <input
                                                            type="file"
                                                            accept=".txt,.b64"
                                                            onChange={handleFileUploadForDecode}
                                                            className="hidden"
                                                            id="base64-file-upload"
                                                        />
                                                        <label
                                                            htmlFor="base64-file-upload"
                                                            className="flex flex-col items-center cursor-pointer"
                                                        >
                                                            <FileUp className="w-8 h-8 text-cyan-400" />
                                                            <span className="mt-2 text-sm text-gray-400">
                                                                Upload a file containing Base64
                                                            </span>
                                                        </label>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Filename with extension (e.g., image.jpg)"
                                                    value={fileName}
                                                    onChange={(e) => setFileName(e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-gray-800 border border-cyan-600 rounded text-white"
                                                />
                                                <Button
                                                    onClick={handleFileDecode}
                                                    className="bg-cyan-600 hover:bg-cyan-700"
                                                    disabled={!input || !fileName}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {output && mode === 'encode' && (
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">
                                                Base64 Output:
                                            </label>
                                            <div className="relative">
                                                <Textarea
                                                    value={output}
                                                    readOnly
                                                    className="h-32 bg-gray-800 border-cyan-600 text-white"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <Button
                                                        onClick={handleCopy}
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            const blob = new Blob([output], { type: 'text/plain' });
                                                            const url = URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.download = 'base64-output.txt';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            URL.revokeObjectURL(url);
                                                        }}
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 border-cyan-500 text-cyan-400 hover:bg-cyan-500"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}