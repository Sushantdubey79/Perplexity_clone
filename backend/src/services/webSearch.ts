export interface WebSearch<T> {

    SearchWeb : (query: string) => Promise<T>;

}