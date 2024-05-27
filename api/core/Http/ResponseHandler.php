<?php

namespace Core\Http;

class ResponseHandler
{
    public function HandleResponse(Response $response) : void
    {
        http_response_code($response->statusCode);

        foreach ($response->headers as $header) {
            header($header);
        }

        if($response->data !== null){
            echo json_encode(['data' => $response->data]);
        }
        else if($response->error != ""){
            echo json_encode(['error' => $response->error]);
        }

        exit();
    }
}