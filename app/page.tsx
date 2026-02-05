import { gql } from "@apollo/client";
import client from "./lib/apollo-client";

const GET_FILMS = gql`
    query {
        pokemon_v2_pokemon(limit: 30) {
            height
            id
            name
        }
    }
`;

export default async function Home() {
    try {
        const { data } = await client.query({ query: GET_FILMS });
        type Pokemon = { name: string };
        return (
            <div>
                <h1>Pokemon List</h1>
                <ul>
                    {(data.pokemon_v2_pokemon as Pokemon[]).map((pokemon) => (
                        <li key={pokemon.name}>{pokemon.name}</li>
                    ))}
                </ul>
            </div>
        );
    } catch (error) {
        console.error("GraphQL Error:", error);
        return <p>Error fetching data</p>;
    }
}
