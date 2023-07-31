# DAnki: Collaborative Anki Card Creation Platform

DAnki is a collaborative website designed to simplify the creation of Anki Cards. Anki is a powerful spaced repetition flashcard system that helps language learners, students, and educators optimize their learning experience. DAnki leverages the real-time collaboration capabilities of GunDB servers and the distributed hosting capabilities of IPFS to provide a seamless and collaborative environment for users to create and share Anki Cards.

## Key Features:

- Real-time Collaboration: Collaborate with others in real-time to create and edit Anki Cards together.

- CrowdAnki Export: Easily export your collaborative Anki decks using the CrowdAnki addon for Anki.

- Angular and Angular Material: DAnki is built with Angular and Angular Material, providing a modern and user-friendly interface.

- IPFS Hosting: DAnki is hosted on IPFS and Syncs the Decks with GunDB to enable offline use with a local IPFS Node

## Who is DAnki for?

DAnki is designed for language learners, students, educators, and anyone seeking to optimize their Anki experience with Collaboration. Whether you study alone or in groups, DAnki empowers you to create effective Anki Cards collaboratively.

## Get Started:

1. Set up a local IPFS Server (e.g., using Brave) or use a public Gateway.

2. Access DAnki using the latest CID or the DNS link danki.menzel.lol.

3. Create a new deck or collaborate on an existing one.

4. Install the [CrowdAnki Addon](https://ankiweb.net/shared/info/1788670778) in Anki.

5. In Anki, import the downloaded `deck.json` by clicking "CrowdAnki: Import from Disk" in the menu.

### DIY (Development):

1. Clone the Git project.

2. Install the Angular CLI globally: `npm install -g @angular/cli`.

3. Set up a GunDB server and update the defaults in `settings.service.ts`.

4. Build the project: `ng build`.

5. Set up an IPFS node.

6. Upload `/dist/danki` to your IPFS node.

7. Open `localhost:8080/ipfs/<CID>` to access your locally hosted DAnki instance.

## Contribute and Support:

We welcome contributions from developers, designers, and Anki enthusiasts to help improve DAnki further. Feel free to contribute to the project on GitHub or share any ideas and feedback.

## License:

DAnki is released under the GPLv3. Please refer to the LICENSE file for more details.
