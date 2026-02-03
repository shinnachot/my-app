import { NextResponse } from "next/server";

// Define the Book type
interface Book {
    id: number;
    title: string;
}

// In-memory database
const books: Book[] = [
    { id: 1, title: "The Great Gatsby" },
    { id: 2, title: "1984" },
    { id: 3, title: "To Kill a Mockingbird" },
];

// 📌 PUT: Update a book
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { title } = await req.json();
    const bookIndex = books.findIndex((b) => b.id === Number(params.id));

    if (bookIndex === -1) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    books[bookIndex].title = title;
    return NextResponse.json(books[bookIndex]);
}

// 📌 DELETE: Remove a book
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const bookIndex = books.findIndex((b) => b.id === Number(params.id));

    if (bookIndex === -1) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const deletedBook = books.splice(bookIndex, 1);
    return NextResponse.json(deletedBook[0], { status: 200 });
}
