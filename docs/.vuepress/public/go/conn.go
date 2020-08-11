package main

import (
	"log"
	"net/http"
	"sync"
	"time"
)

func IsUrlOk(url string) bool {
	response, err := http.Get(url)
	if err != nil {
		log.Fatalf("[IsUrlOk] get url【%s】error! error is %s", url, err.Error())
		return false
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		log.Println("response.StatusCode", response.StatusCode)
		return false
	}
	return true
}

func IsUrlOk2(url string) bool {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("req err")
		return false
	}
	req.Close = true
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatalf("[IsUrlOk] get url【%s】error! error is %s", url, err.Error())
		return false
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		log.Println("response.StatusCode", response.StatusCode)
		return false
	}
	return true
}

func main() {
	url := "https://npm.taobao.org/mirrors/node/v14.7.0/node-v14.7.0-win-x64.zip"
	// url := "https://cdn.npm.taobao.org/dist/node/v14.7.0/node-v14.7.0-win-x64.zip"
	// b := IsUrlOk(url)
	// b := IsUrlOk2(url)
	// log.Println(b)

	var wg sync.WaitGroup
	startTime := time.Now()

	for i := 0; i <= 100; i++ {
		wg.Add(1)
		go func() {
			// b := IsUrlOk(url)
			IsUrlOk2(url)
			wg.Done()
		}()
	}

	wg.Wait()

	log.Println(time.Since(startTime))

	time.Sleep(1 * time.Second)
}
