import { NextResponse } from "next/server";

type Book = {
    id: number;
    title: string;
};

const books: Book[] = [
    { id: 1, title: "The Great Gatsby" },
    { id: 2, title: "1984" },
    { id: 3, title: "To Kill a Mockingbird" },
];

// Handle GET request
export async function GET() {
    return NextResponse.json(books);
}

// Handle POST request
export async function POST(req: Request) {
    const body = await req.json();
    const { title } = body;

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newBook: Book = { id: books.length + 1, title };
    books.push(newBook);
    return NextResponse.json(newBook, { status: 201 });
}
