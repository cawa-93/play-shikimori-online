import {Author as AuthorInterface} from '@/interfaces/Author';
import {Author, AuthorContext} from '@/classes/Authors';



/**
 * AuthorFactory used flyweight pattern for caching Authors objects
 *
 * @see https://refactoring.guru/uk/design-patterns/flyweight
 */
export class AuthorFactory {



  public static getAuthor(context: AuthorContext): AuthorInterface {
    const study = AuthorFactory.getStudiesName(context.authorsSummary);
    let author = this.cache.get(study);
    if (!author) {
      author = new Author(context);
      this.cache.set(study, author);
    }

    return author;
  }

  private static cache = new Map<string, AuthorInterface>();



  private static getStudiesName(summary: string) {
    return summary.split(/[()&]/)[0].trim();
  }
}
