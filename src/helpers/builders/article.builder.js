import { faker } from '@faker-js/faker';

export class ArticleBuilder {
    addTitle() {
        this.title = faker.word.noun();
        return this;
    }

    addDescription() {
        this.description = faker.word.noun();
        return this;
    }

    addBody(symbol = 10) {
        this.body = faker.word.noun({ length: symbol });
        return this;
    }

    addTags(symbol = 10) {
        this.tags = faker.word.noun({ length: symbol });
        return this;
    }

    generate() {
        return { ...this };
    }
}