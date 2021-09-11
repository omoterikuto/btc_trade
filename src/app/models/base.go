package models

import (
	"fmt"
	"src/config"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func GetCandleTableName(productCode string, duration time.Duration) string {
	return fmt.Sprintf("%s_%s", productCode, duration)
}

var Db *gorm.DB

func init() {
	var err error
	Db, err = sqlConnect()
	if err != nil {
		fmt.Println(err)
	}

	err = migrate()
	if err != nil {
		fmt.Println(err)
	}
}

func sqlConnect() (sqlDb *gorm.DB, err error) {
	c := config.Config
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true&loc=%s", c.DbUser, c.DbPassword, c.DbContainer, c.DbPort, c.DbName, "Asia%2FTokyo")

	// db, err := gorm.Open(mysql.Open(dataSourceName),mysql.New(mysql.Config{
	// 	DisableDatetimePrecision: true,
	// }), &gorm.Config{})

	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN:                      dataSourceName, // data source name
		DisableDatetimePrecision: true,           // disable datetime precision, which not supported before MySQL 5.6
	}), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	count := 0

	if err != nil {
		for {
			if err == nil {
				break
			}
			fmt.Print(".")
			time.Sleep(time.Second)
			count++
			if count > 20 {
				fmt.Println("DB接続失敗")
				return nil, err
			}
			db, err = gorm.Open(mysql.New(mysql.Config{
				DriverName: "mysql",
				DSN:        dataSourceName,
			}), &gorm.Config{})
		}
	}

	fmt.Println("DB接続成功")

	return db, err
}

func migrate() (err error) {
	Db.AutoMigrate(&SignalEvent{})

	for _, duration := range config.Config.Durations {
		tableName := GetCandleTableName(config.Config.ProductCode, duration)
		if !Db.Migrator().HasTable(tableName) {
			err := Db.Migrator().CreateTable(&Candle{})
			if err != nil {
				return err
			}
			err = Db.Migrator().RenameTable(&Candle{}, tableName)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
