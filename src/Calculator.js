import { MissionUtils } from "@woowacourse/mission-utils";
import { errorMessage } from "./utils/errorMessage.js";

class Calculator {
    async start() {
        try {
            await this.GetUserInput();
        } catch (error) {
            MissionUtils.Console.print(error.message); 
            throw new Error('[ERROR]');
        }
    }

    async GetUserInput() {
        const userInput = await MissionUtils.Console.readLineAsync('덧셈할 문자열을 입력해주세요.(쉼표와 콜론 외에 //와 \\n 사이에 입력한 문자열을 커스텀 구분자로 사용 가능합니다.):\n');
        
        // 올바른 값인지 확인
        const result = this.validateInput(userInput);
        if (result) MissionUtils.Console.print(`결과 : ${result}`);
    }

    validateInput(input) {
        let result = 0;
        let userInput = input.trim();
        
        // 입력값이 없을 때 throw new Error
        if(!userInput) throw new Error(errorMessage.NO_INPUT);

        const separators = [',',':'];

        // 커스텀 구분자가 있는지
        if(userInput.startsWith("//")) {
            const nIndex = userInput.indexOf("\\n");
            if (nIndex > -1) {
                const customSeparator = userInput.slice(2,nIndex);
                
                // 커스텀 구분자를 기본 구분자 중 하나인 쉼표로 치환
                userInput = userInput.slice(nIndex + 2).split(customSeparator).join(',');
            }
        }
        
        // 쉼표 또는 콜론 구분자가 있는지
        const hasDefaultSeparator = separators.some(v => userInput.includes(v));

        // 구분자가 아닌 문자가 포함되어 있는지
        const includeInvalidStr = userInput.split(/[,|:]/).filter(Boolean).map(Number).some(v => Number.isNaN(v));

        // 양수인지
        let isPositiveNum = false;
       
        const numbers = hasDefaultSeparator ? userInput.split(/[,|:]/).filter(Boolean).map(Number) : 
        userInput.match(/-?\d+/g).map(Number);

        if(numbers && numbers.length > 0) {
            isPositiveNum = numbers.every(v => v > 0);
            // 올바른 값일 때
            if(isPositiveNum && !includeInvalidStr) {
               const sum = numbers.reduce((acc, curr) => acc + curr, 0);
               result = sum;
            }
        }

        // 예외 처리
        this.handleError(hasDefaultSeparator, isPositiveNum, includeInvalidStr);
        
        return result;
    }

    handleError(hasDefaultSeparator, isPositiveNum, includeInvalidStr) {
        if(!hasDefaultSeparator && !isPositiveNum) {
            throw new Error(errorMessage.NONE_OF_THE_VALUE);
        } else if(includeInvalidStr) {
            throw new Error(errorMessage.INCLUDE_INVALID_VALUE);
        } else if(!isPositiveNum) {
            throw new Error(errorMessage.NOT_POSITIVE_NUM);
        }
    }
}

export default Calculator;