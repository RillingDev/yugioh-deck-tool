import { injectable } from "inversify";
import { Card } from "../model/Card";
import { intersection } from "lodash";

@injectable()
class CardService {
    public isTreatedAsSame(cardA: Card, cardB: Card): boolean {
        return (
            intersection(this.getAllNames(cardA), this.getAllNames(cardB))
                .length > 0
        );
    }

    private getAllNames(card: Card): string[] {
        const names = [card.name];
        if (card.treatedAs != null) {
            names.push(card.treatedAs);
        }
        return names;
    }
}

export { CardService };
