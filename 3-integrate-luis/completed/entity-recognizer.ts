
import * as Recognizers from '@microsoft/recognizers-text-suite';
// tslint:disable-next-line:no-var-requires
const chrono = require('chrono-node');

export class EntityRecognizer {
  public static dateExp = /^\d{4}-\d{2}-\d{2}/i;
  public static findEntity(entities: any, type: string): any {
    for (let i = 0; entities && i < entities.length; i++) {
        if (entities[i].type === type) {
            return entities[i];
        }
    }
    return null;
  }

  public static recognizeDateTime(text: string, refDate?: Date): Date | null {
    let response: any;
    try {
        const results = chrono.parse(text, refDate);
        if (results && results.length > 0) {
            const duration = results[0];
            response = {
                endIndex: duration.index + duration.text.length,                
                entity: duration.text,                                
                resolution: {
                    resolution_type: 'chrono.duration',
                    start: duration.start.date()
                },
                startIndex: duration.index,
                type: 'chrono.duration'                               
            };
            if (duration.end) {
                response.resolution.end = duration.end.date();
            }
            if (duration.ref) {
                response.resolution.ref = duration.ref;
            }
            // Calculate a confidence score based on text coverage and call compareConfidence.
            response.score = duration.text.length / text.length;

            return response.resolution.start;
        }
    } catch (err) {
        console.error('Error recognizing time: ' + err.toString());
        response = null;
    }
    
    return null;
  }

  public static recognizeNumber(text: string): number | undefined {
    const results = Recognizers.recognizeNumber(text, Recognizers.Culture.English);
    const size =  results && results[0] && results[0].resolution.value;
    return parseInt(size, 10);
  }
}
