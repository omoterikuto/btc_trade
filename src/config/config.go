package config

import (
	"log"
	"os"
	"path"
	"runtime"
	"time"

	"google.golang.org/appengine"
	"gopkg.in/ini.v1"
)

type ConfigList struct {
	LogFile     string
	ProductCode string
	BaseUrl     string
	Durations   map[string]time.Duration

	DbName      string
	SQLDriver   string
	DbUser      string
	DbPort      int
	DbPassword  string
	DbContainer string

	DbConection string

	WebPort int

	ApiKey    string
	ApiSecret string
}

var Config ConfigList

func init() {
	setTimeZone()

	// test実行時カレントディレクトリが実行するtestのディレクトリになるのを防ぐ
	if !appengine.IsAppEngine() {
		_, filename, _, _ := runtime.Caller(0)
		dir := path.Join(path.Dir(filename), "..")
		err := os.Chdir(dir)
		if err != nil {
			log.Fatal("Failed to change working directory: ", err)
		}
	}

	cfg, err := ini.Load("config/config.ini")
	if err != nil {
		log.Fatal("Failed to read file: ", err)
	}

	durations := map[string]time.Duration{
		"1m": time.Minute,
		"1h": time.Hour,
		"1d": time.Hour * 24,
	}

	var baseUrl string
	if appengine.IsAppEngine() {
		baseUrl = cfg.Section("btc_trade").Key("gae_app_url").String()
	} else {
		baseUrl = cfg.Section("btc_trade").Key("local_app_url").String()
	}

	Config = ConfigList{
		LogFile:     cfg.Section("btc_trade").Key("log_file").String(),
		ProductCode: cfg.Section("btc_trade").Key("product_code").String(),
		BaseUrl:     baseUrl,
		Durations:   durations,

		DbName:      cfg.Section("db").Key("name").String(),
		SQLDriver:   cfg.Section("db").Key("driver").String(),
		DbUser:      cfg.Section("db").Key("user").String(),
		DbPort:      cfg.Section("db").Key("port").MustInt(),
		DbPassword:  cfg.Section("db").Key("password").String(),
		DbContainer: cfg.Section("db").Key("container").String(),
		DbConection: cfg.Section("db").Key("connection_name").String(),

		WebPort: cfg.Section("web").Key("port").MustInt(),

		ApiKey:    cfg.Section("bitflyer").Key("api_key").String(),
		ApiSecret: cfg.Section("bitflyer").Key("api_secret").String(),
	}
}

var Location *time.Location

func setTimeZone() {
	var err error
	Location, err = time.LoadLocation("Asia/Tokyo")
	if err != nil {
		Location = time.FixedZone("Asia/Tokyo", 9*60*60)
	}
	time.Local = Location
}
