export class ArticlePage {
    constructor(page) {
        // техническое описание страницы
        //create
        this.newArticle = page.getByRole('link', { name: ' New Article' });
        this.chooseTitle = page.getByRole('textbox', { name: 'Article Title' });
        this.chooseDescription = page.getByRole('textbox', { name: 'What\'s this article about?' });
        this.chooseBody = page.getByRole('textbox', { name: 'Write your article (in' });
        this.chooseTags = page.getByRole('textbox', { name: 'Enter tags' });
        this.articlePublish = page.getByText('Publish Article');
        this.articletag = page.getByRole('main');
        this.articleTitle = page.getByRole('heading');
        this.articleBody = page.getByRole('paragraph');
        //update
        this.editArticle = page.getByRole('link', { name: ' Edit Article' });
        this.articleUpdate = page.getByRole('button', { name: 'Update Article' });
        //post comment
        this.writeComment = page.getByRole('textbox', { name: 'Write a comment...' });
        this.postComment = page.getByRole('button', { name: 'Post Comment' });
        //favorite
        this.userProfile = page.locator('.user-pic');
        this.linkProfile = page.getByRole('link', { name: ' Profile' });
        this.favoriteTab = page.getByRole('link', { name: 'Favorited Articles' });
        this.myTab = page.getByRole('link', { name: 'My Articles' });
    }
    // бизнесовые действия со страницой
    async createNewArticle(article) {
        const {title, description, body, tags} = article
        await this.newArticle.click();
        await this.chooseTitle.click();
        await this.chooseTitle.fill(title);
        await this.chooseDescription.click();
        await this.chooseDescription.fill(description);
        await this.chooseBody.click();
        await this.chooseBody.fill(body);
        await this.chooseTags.click();
        await this.chooseTags.fill(tags);
        await this.articlePublish.click();

    }

    async updateArticle(article) {
        const {title, body} = article
        await this.editArticle.nth(1).click();
        await this.chooseTitle.click();
        await this.chooseTitle.clear();
        await this.chooseTitle.fill(title);
        await this.chooseBody.click();
        await this.chooseBody.clear();
        await this.chooseBody.fill(body);
        await this.articleUpdate.click();
    }

    async newPostComment() {
        await this.writeComment.click();
        await this.writeComment.fill('новый коммент');
        await this.postComment.click();
    }

    async goToMyTab() {
        await this.userProfile.click();
        await this.linkProfile.click();
        await this.myTab.click();
    }

    async goToFavoriteTab() {
        await this.userProfile.click();
        await this.linkProfile.click();
        await this.favoriteTab.click();
    }
}