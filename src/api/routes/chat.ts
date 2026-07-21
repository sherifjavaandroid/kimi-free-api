import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import Response from '@/lib/response/Response.ts';
import chat from '@/api/controllers/chat.ts';
import agent from '@/api/controllers/agent.ts';
import logger from '@/lib/logger.ts';

export default {

    prefix: '/v1/chat',

    post: {

        '/completions': async (request: Request) => {
            request
                .validate('body.conversation_id', v => _.isUndefined(v) || _.isString(v))
                .validate('body.messages', _.isArray)
                .validate('headers.authorization', _.isString)
            // refresh_token切分
            const tokens = chat.tokenSplit(request.headers.authorization);
            // 随机挑选一个refresh_token
            const token = _.sample(tokens);
            const { model, conversation_id: convId, messages, stream, use_search, tools, tool_choice } = request.body;
            const hasTools = _.isArray(tools) && tools.length > 0 && tool_choice !== "none";
            if (stream) {
                const stream = hasTools
                    ? await agent.createChatCompletionStream(model, messages, token, tools, tool_choice)
                    : await chat.createCompletionStream(model, messages, token, use_search, convId);
                return new Response(stream, {
                    type: "text/event-stream"
                });
            }
            else
                return hasTools
                    ? await agent.createChatCompletion(model, messages, token, tools, tool_choice)
                    : await chat.createCompletion(model, messages, token, use_search, convId);
        }

    }

}